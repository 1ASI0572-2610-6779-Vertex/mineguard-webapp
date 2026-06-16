import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { DriverFormDialog } from '../../components/driver-form-dialog/driver-form-dialog';
import { DriversDirectory } from '../../components/drivers-directory/drivers-directory';
import { VehicleFormDialog } from '../../components/vehicle-form-dialog/vehicle-form-dialog';
import { VehiclesInventory } from '../../components/vehicles-inventory/vehicles-inventory';

type FleetTab = 'vehicles' | 'drivers';

@Component({
  selector: 'app-fleet-and-drivers-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    VehiclesInventory,
    DriversDirectory,
    TranslatePipe,
  ],
  templateUrl: './fleet-and-drivers-page.html',
  styleUrl: './fleet-and-drivers-page.css',
})
export class FleetAndDriversPage implements OnInit {
  private store  = inject(AssetsStore);
  private dialog = inject(MatDialog);

  readonly activeTab = signal<FleetTab>('vehicles');
  readonly vehicles  = this.store.vehicles;
  readonly drivers   = this.store.drivers;
  readonly error     = this.store.error;

  ngOnInit(): void {
    this.store.loadVehicles();
    this.store.loadDrivers();
  }

  selectTab(tab: FleetTab): void {
    this.activeTab.set(tab);
  }

  openAddVehicle(): void {
    this.dialog.open(VehicleFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      panelClass: 'mg-dialog',
      data: {},
    });
  }

  openAddDriver(): void {
    this.dialog.open(DriverFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      panelClass: 'mg-dialog',
      data: {},
    });
  }
}
