import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { CatalogSummary } from '../domain/model/catalog-summary.entity';
import { Driver } from '../domain/model/driver.entity';
import { SaveDriverCommand } from '../domain/model/save-driver.command';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VehicleStatus } from '../domain/model/vehicle-status';
import { DriverResource } from '../infrastructure/driver-response';
import { AssetsApi } from '../infrastructure/assets-api';

@Injectable({ providedIn: 'root' })
export class AssetsStore {
  private readonly catalogSummarySignal = signal<CatalogSummary | null>(null);
  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  private readonly driversSignal = signal<Driver[]>([]);
  private readonly errorSignal = signal<string | null>(null);

  readonly catalogSummary = this.catalogSummarySignal.asReadonly();
  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly drivers = this.driversSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private assetsApi: AssetsApi) {}

  loadCatalogSummary(): void {
    this.errorSignal.set(null);
    this.assetsApi.getCatalogSummary().subscribe({
      next: (summaries) => this.catalogSummarySignal.set(summaries[0] ?? null),
      error: (err) => {
        console.error('Failed to load catalog summary:', err);
        this.errorSignal.set('Failed to load catalog summary');
      },
    });
  }

  loadVehicles(): void {
    this.errorSignal.set(null);
    this.assetsApi.getVehicles().subscribe({
      next: (vehicles) => this.vehiclesSignal.set(vehicles),
      error: (err) => {
        console.error('Failed to load vehicles:', err);
        this.errorSignal.set('Failed to load vehicles');
      },
    });
  }

  loadDrivers(): void {
    this.errorSignal.set(null);
    this.assetsApi.getDrivers().subscribe({
      next: (drivers) => this.driversSignal.set(drivers),
      error: (err) => {
        console.error('Failed to load drivers:', err);
        this.errorSignal.set('Failed to load drivers');
      },
    });
  }

  /** Toggles vehicle operational status in-place (existing behaviour). */
  updateVehicleStatus(vehicleId: number, status: VehicleStatus): void {
    const current = this.vehiclesSignal().find((v) => v.id === vehicleId);
    if (!current) return;

    const updated = new Vehicle({
      id: current.id,
      code: current.code,
      model: current.model,
      category: current.category,
      status,
      assignedDriverName: status === 'maintenance' ? null : current.assignedDriverName,
      shiftLabel: status === 'maintenance' ? null : current.shiftLabel,
    });

    this.assetsApi.updateVehicle(updated).subscribe({
      next: (vehicle) => this.vehiclesSignal.update((list) => list.map((v) => (v.id === vehicle.id ? vehicle : v))),
      error: (err) => {
        console.error('Failed to update vehicle status:', err);
        this.errorSignal.set('Failed to update vehicle status');
      },
    });
  }

  // ── Observable-returning variants used by form dialogs ──────────────────

  /** Creates a vehicle via API and prepends it to the local list. */
  createVehicle$(vehicle: Vehicle): Observable<Vehicle> {
    return this.assetsApi.createVehicle(vehicle).pipe(
      tap((created) => this.vehiclesSignal.update((list) => [created, ...list])),
    );
  }

  /** Updates a vehicle via API and replaces the entry in the local list. */
  updateVehicle$(vehicle: Vehicle): Observable<Vehicle> {
    return this.assetsApi.updateVehicle(vehicle).pipe(
      tap((updated) => this.vehiclesSignal.update((list) => list.map((v) => (v.id === updated.id ? updated : v)))),
    );
  }

  /** POST /drivers — creates a driver and refreshes the local directory list. */
  createDriver$(command: SaveDriverCommand): Observable<DriverResource> {
    return this.assetsApi.createDriver(command).pipe(
      tap(() => this.loadDrivers()),
    );
  }

  /** PUT /drivers/{id} — updates a driver and refreshes the local directory list. */
  updateDriver$(command: SaveDriverCommand): Observable<DriverResource> {
    return this.assetsApi.updateDriver(command).pipe(
      tap(() => this.loadDrivers()),
    );
  }
}
