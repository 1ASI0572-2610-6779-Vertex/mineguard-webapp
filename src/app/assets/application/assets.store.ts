import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { CompanyKpisStore } from '../../shared/application/company-kpis.store';
import { CatalogSummary } from '../domain/model/catalog-summary.entity';
import { Driver } from '../domain/model/driver.entity';
import { SaveDriverCommand } from '../domain/model/save-driver.command';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VehicleStatus } from '../domain/model/vehicle-status';
import { DriverResource } from '../infrastructure/driver-response';
import { AssetsApi } from '../infrastructure/assets-api';

@Injectable({ providedIn: 'root' })
export class AssetsStore {
  private readonly kpisStore = inject(CompanyKpisStore);

  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  private readonly driversSignal = signal<Driver[]>([]);
  private readonly errorSignal = signal<string | null>(null);

  /** Catalog counts, derived from the shared tenant-KPIs cache. */
  readonly catalogSummary = computed(() => {
    const kpis = this.kpisStore.kpis();
    return kpis ? CatalogSummary.fromKpis(kpis) : null;
  });
  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly drivers = this.driversSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private assetsApi: AssetsApi) {}

  loadCatalogSummary(): void {
    // Catalog counts come from the shared CompanyKpisStore (one cached KPIs fetch
    // shared with the dashboard and fleet summaries). `catalogSummary` is a
    // computed projection over that cache.
    this.kpisStore.load();
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

  /**
   * Soft-deletes (archives) a vehicle and drops it from the local list on success.
   * The backend rejects this with `409` when the vehicle still has an active
   * device — the caller surfaces that message and leaves the list untouched.
   */
  archiveVehicle$(id: number): Observable<void> {
    return this.assetsApi.archiveVehicle(id).pipe(
      tap(() => this.vehiclesSignal.update((list) => list.filter((v) => v.id !== id))),
    );
  }

  /** Soft-deletes (deactivates) a driver and drops it from the local directory. */
  deactivateDriver$(id: number): Observable<void> {
    return this.assetsApi.deactivateDriver(id).pipe(
      tap(() => this.driversSignal.update((list) => list.filter((d) => d.id !== id))),
    );
  }

  /** POST /drivers — creates a driver and refreshes the local directory list. */
  createDriver$(command: SaveDriverCommand): Observable<DriverResource> {
    return this.assetsApi.createDriver(command).pipe(
      tap(() => this.loadDrivers()),
    );
  }

  /** PATCH /drivers/{id} — updates a driver and refreshes the local directory list. */
  updateDriver$(command: SaveDriverCommand): Observable<DriverResource> {
    return this.assetsApi.updateDriver(command).pipe(
      tap(() => this.loadDrivers()),
    );
  }
}
