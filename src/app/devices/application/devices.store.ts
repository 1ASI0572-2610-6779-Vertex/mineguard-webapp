import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AssetsApi } from '../../assets/infrastructure/assets-api';
import { Vehicle } from '../../assets/domain/model/vehicle.entity';
import { IamStore } from '../../iam/application/iam.store';
import { Device } from '../domain/model/device.entity';
import { RegisterDeviceCommand } from '../domain/model/register-device.command';
import { DeviceApiError, isDeviceApiError } from '../infrastructure/device-api-error';
import { DevicesApi } from '../infrastructure/devices-api';

/**
 * Error surfaced to the devices view. `key` is an i18n key describing the
 * failure; `backendMessage` carries the raw API `message` for a 409 conflict,
 * where the backend explains whether the vehicle already has a device or the
 * deviceId is already in use.
 */
export interface DeviceRegistrationError {
  key: string;
  backendMessage?: string;
}

@Injectable({ providedIn: 'root' })
export class DevicesStore {
  private readonly devicesApi = inject(DevicesApi);
  private readonly assetsApi = inject(AssetsApi);
  private readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  private readonly devicesSignal = signal<Device[]>([]);
  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorKeySignal = signal<string | null>(null);

  readonly devices = this.devicesSignal.asReadonly();
  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly errorKey = this.errorKeySignal.asReadonly();

  /** Lookup of vehicleId → vehicle code, used to render the device table. */
  readonly vehicleCodeById = computed(() => {
    const map = new Map<number, string>();
    for (const v of this.vehiclesSignal()) map.set(v.id, v.code);
    return map;
  });

  /** GET /api/v1/vehicles — populates the vehicle <select>. */
  loadVehicles(): void {
    this.assetsApi.getVehicles().subscribe({
      next: (vehicles) => this.vehiclesSignal.set(vehicles),
      error: (err) => this.handleLoadError(err, 'devices.error.loadVehicles'),
    });
  }

  /** GET /api/v1/sensors — populates the device table. */
  loadDevices(): void {
    this.loadingSignal.set(true);
    this.errorKeySignal.set(null);
    this.devicesApi.getDevices().subscribe({
      next: (devices) => {
        this.devicesSignal.set(devices);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.loadingSignal.set(false);
        this.handleLoadError(err, 'devices.error.loadDevices');
      },
    });
  }

  /**
   * POST /api/v1/sensors — registers a device and refreshes the table on success.
   * On session expiry (401/403) the user is signed out. Any other failure is
   * rethrown as a {@link DeviceRegistrationError} for the form to display.
   */
  registerDevice$(command: RegisterDeviceCommand): Observable<Device> {
    return this.devicesApi.registerDevice(command).pipe(
      tap(() => this.loadDevices()),
      catchError((err: unknown) => {
        if (isDeviceApiError(err) && this.isSessionExpired(err)) {
          this.iamStore.signOut(this.router);
          return throwError(() => ({ key: 'devices.error.sessionExpired' } as DeviceRegistrationError));
        }
        return throwError(() => this.toRegistrationError(err));
      }),
    );
  }

  private isSessionExpired(err: DeviceApiError): boolean {
    return err.status === 401 || err.status === 403;
  }

  private toRegistrationError(err: unknown): DeviceRegistrationError {
    if (!isDeviceApiError(err)) return { key: 'devices.error.generic' };
    switch (err.status) {
      case 400:
        return { key: 'devices.error.badRequest' };
      case 404:
        return { key: 'devices.error.vehicleNotFound' };
      case 409:
        // Backend message explains the specific conflict (vehicle already bound
        // or deviceId already in use) — surface it verbatim.
        return { key: 'devices.error.conflict', backendMessage: err.message || undefined };
      default:
        return { key: 'devices.error.generic' };
    }
  }

  private handleLoadError(err: unknown, fallbackKey: string): void {
    if (isDeviceApiError(err) && this.isSessionExpired(err)) {
      this.iamStore.signOut(this.router);
      return;
    }
    console.error('Devices load failed:', err);
    this.errorKeySignal.set(fallbackKey);
  }
}
