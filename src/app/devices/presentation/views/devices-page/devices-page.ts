import { Component, OnInit, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

import { DevicesStore } from '../../../application/devices.store';

/**
 * Administrator "Devices" view — **read-only audit** of every MineGuard device
 * registered for the tenant.
 *
 * @remarks
 * Device creation/linking now lives in the supervisor's fleet flow (a device is
 * linked when a vehicle is created), so this page no longer registers devices —
 * it only lists them for oversight. It still loads the vehicles so each device
 * row can resolve its vehicle code.
 */
@Component({
  selector: 'app-devices-page',
  standalone: true,
  imports: [MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './devices-page.html',
  styleUrl: './devices-page.css',
})
export class DevicesPage implements OnInit {
  private readonly store = inject(DevicesStore);

  readonly devices = this.store.devices;
  readonly loading = this.store.loading;
  readonly loadErrorKey = this.store.errorKey;
  private readonly vehicleCodeById = this.store.vehicleCodeById;

  readonly deviceCount = computed(() => this.devices().length);

  ngOnInit(): void {
    this.store.loadVehicles();
    this.store.loadDevices();
  }

  /** Resolves a vehicleId to its vehicle code for the table, falling back to `#id`. */
  vehicleCode(vehicleId: number): string {
    return this.vehicleCodeById().get(vehicleId) ?? `#${vehicleId}`;
  }
}
