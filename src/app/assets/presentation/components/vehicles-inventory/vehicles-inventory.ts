import { Component, Input, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { Vehicle } from '../../../domain/model/vehicle.entity';

/**
 * "Inventario de Vehículos" table for the supervisor "Flota y Conductores"
 * view. Per-row toggle between operational ↔ maintenance.
 */
@Component({
  selector: 'app-vehicles-inventory',
  standalone: true,
  imports: [MatButton, MatIconButton, MatIcon, TranslatePipe],
  templateUrl: './vehicles-inventory.html',
  styleUrl: './vehicles-inventory.css',
})
export class VehiclesInventory {
  private store = inject(AssetsStore);

  @Input({ required: true }) vehicles: Vehicle[] = [];

  sendToMaintenance(vehicle: Vehicle): void {
    this.store.updateVehicleStatus(vehicle.id, 'maintenance');
  }

  markOperational(vehicle: Vehicle): void {
    this.store.updateVehicleStatus(vehicle.id, 'operational');
  }
}
