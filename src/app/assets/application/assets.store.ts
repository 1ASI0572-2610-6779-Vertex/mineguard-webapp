import { Injectable, signal } from '@angular/core';

import { CatalogSummary } from '../domain/model/catalog-summary.entity';
import { Driver } from '../domain/model/driver.entity';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VehicleStatus } from '../domain/model/vehicle-status';
import { AssetsApi } from '../infrastructure/assets-api';

/**
 * Application service for the assets bounded context.
 *
 * @remarks
 * Holds three projections:
 * - Catalog summary (admin "Auditoría y Activos")
 * - Vehicles inventory (supervisor "Flota y Conductores" → tab Vehículos)
 * - Drivers directory (supervisor "Flota y Conductores" → tab Conductores)
 *
 * All loads run via plain `subscribe()` (no `takeUntilDestroyed`) because the
 * store is a root singleton and the calls happen from component `ngOnInit`.
 */
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

  /**
   * Loads the catalog summary aggregate on demand.
   */
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

  /**
   * Loads the vehicles inventory on demand.
   */
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

  /**
   * Loads the drivers directory on demand.
   */
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

  /**
   * Updates the operational status of a vehicle ("Enviar a Taller" /
   * "Marcar Operativo") and replaces the entry in the local inventory signal
   * on success.
   */
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

    this.errorSignal.set(null);
    this.assetsApi.updateVehicle(updated).subscribe({
      next: (vehicle) => {
        this.vehiclesSignal.update((list) =>
          list.map((v) => (v.id === vehicle.id ? vehicle : v)),
        );
      },
      error: (err) => {
        console.error('Failed to update vehicle status:', err);
        this.errorSignal.set('Failed to update vehicle status');
      },
    });
  }
}
