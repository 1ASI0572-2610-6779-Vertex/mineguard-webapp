import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { Vehicle } from '../../../domain/model/vehicle.entity';
import { VehicleDialogData, VehicleFormDialog } from '../vehicle-form-dialog/vehicle-form-dialog';

@Component({
  selector: 'app-vehicles-inventory',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, TranslatePipe],
  templateUrl: './vehicles-inventory.html',
  styleUrl: './vehicles-inventory.css',
})
export class VehiclesInventory {
  private store  = inject(AssetsStore);
  private dialog = inject(MatDialog);

  @Input({ required: true }) vehicles: Vehicle[] = [];

  openEdit(vehicle: Vehicle): void {
    this.dialog.open(VehicleFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      panelClass: 'mg-dialog',
      data: { vehicle } as VehicleDialogData,
    });
  }

  sendToMaintenance(vehicle: Vehicle): void {
    this.store.updateVehicleStatus(vehicle.id, 'maintenance');
  }

  markOperational(vehicle: Vehicle): void {
    this.store.updateVehicleStatus(vehicle.id, 'available');
  }
}
