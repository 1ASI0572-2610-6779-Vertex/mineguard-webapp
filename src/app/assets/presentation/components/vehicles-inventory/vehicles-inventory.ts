import { Component, Input, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { Vehicle } from '../../../domain/model/vehicle.entity';
import { DeviceRegistrationError, DevicesStore } from '../../../../devices/application/devices.store';
import { CompanyKpisStore } from '../../../../shared/application/company-kpis.store';
import { ConfirmService } from '../../../../shared/presentation/services/confirm.service';
import { NotificationService } from '../../../../shared/presentation/services/notification.service';
import { MoveDeviceDialog, MoveDeviceDialogData } from '../move-device-dialog/move-device-dialog';
import { VehicleDialogData, VehicleFormDialog } from '../vehicle-form-dialog/vehicle-form-dialog';

@Component({
  selector: 'app-vehicles-inventory',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './vehicles-inventory.html',
  styleUrl: './vehicles-inventory.css',
})
export class VehiclesInventory {
  private store  = inject(AssetsStore);
  private devicesStore = inject(DevicesStore);
  private kpisStore = inject(CompanyKpisStore);
  private notify = inject(NotificationService);
  private confirm = inject(ConfirmService);
  private dialog = inject(MatDialog);

  @Input({ required: true }) vehicles: Vehicle[] = [];

  /** When on, only vehicles without a linked device are listed. */
  readonly showOnlyNoDevice = signal(false);
  /** Id of the vehicle whose device is being linked inline (disables its button). */
  readonly linkingVehicleId = signal<number | null>(null);

  /** Vehicles honoring the "sin device" filter. */
  get displayedVehicles(): Vehicle[] {
    return this.showOnlyNoDevice() ? this.vehicles.filter((v) => !v.hasDevice) : this.vehicles;
  }

  /** How many vehicles currently lack a device — drives the filter badge. */
  get noDeviceCount(): number {
    return this.vehicles.filter((v) => !v.hasDevice).length;
  }

  toggleNoDeviceFilter(): void {
    this.showOnlyNoDevice.update((on) => !on);
  }

  openEdit(vehicle: Vehicle): void {
    this.dialog.open(VehicleFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      panelClass: 'mg-dialog',
      data: { vehicle } as VehicleDialogData,
    });
  }

  /**
   * Links a device to an existing vehicle that has none (the "sin device" retry
   * path). The backend assigns the sequential deviceId; on success we reload the
   * inventory so the row flips to "linked" and refresh the toolbar KPIs.
   */
  linkDevice(vehicle: Vehicle): void {
    if (this.linkingVehicleId() !== null) return;
    this.linkingVehicleId.set(vehicle.id);
    this.devicesStore.linkDevice$(vehicle.id).subscribe({
      next: (device) => {
        this.linkingVehicleId.set(null);
        this.store.loadVehicles();
        this.kpisStore.refresh();
        this.notify.success('assets.fleet.vehicles.form.device.linkedSnack', {
          id: device.deviceId,
          code: vehicle.code,
        });
      },
      error: (err: DeviceRegistrationError) => {
        this.linkingVehicleId.set(null);
        this.notify.error(err.key);
      },
    });
  }

  sendToMaintenance(vehicle: Vehicle): void {
    this.store.updateVehicleStatus(vehicle.id, 'maintenance');
  }

  markOperational(vehicle: Vehicle): void {
    this.store.updateVehicleStatus(vehicle.id, 'operational');
  }

  /** Opens the "move device" dialog with the no-device vehicles as candidates. */
  openMoveDevice(vehicle: Vehicle): void {
    const candidates = this.vehicles.filter((v) => !v.hasDevice && v.id !== vehicle.id);
    this.dialog.open(MoveDeviceDialog, {
      width: '480px',
      maxWidth: '95vw',
      panelClass: 'mg-dialog',
      data: { source: vehicle, candidates } as MoveDeviceDialogData,
    });
  }

  /** Retires the device linked to a vehicle (soft-delete, id stays reserved). */
  async retireDevice(vehicle: Vehicle): Promise<void> {
    const ok = await this.confirm.ask({
      titleKey: 'assets.fleet.vehicles.confirm.retire.title',
      messageKey: 'assets.fleet.vehicles.confirm.retire.message',
      confirmKey: 'assets.fleet.vehicles.confirm.retire.confirm',
      danger: true,
      params: { id: vehicle.deviceId },
    });
    if (!ok) return;

    this.devicesStore.retireDeviceByVehicle$(vehicle.id).subscribe({
      next: () => {
        this.store.loadVehicles();
        this.kpisStore.refresh();
        this.notify.success('assets.fleet.vehicles.retiredSnack', { id: vehicle.deviceId });
      },
      error: (err: DeviceRegistrationError) => this.notify.error(err.key),
    });
  }

  /** Soft-deletes (archives) a vehicle. Backend rejects with 409 if it has an active device. */
  async archiveVehicle(vehicle: Vehicle): Promise<void> {
    const ok = await this.confirm.ask({
      titleKey: 'assets.fleet.vehicles.confirm.archive.title',
      messageKey: 'assets.fleet.vehicles.confirm.archive.message',
      confirmKey: 'assets.fleet.vehicles.confirm.archive.confirm',
      danger: true,
      params: { code: vehicle.code },
    });
    if (!ok) return;

    this.store.archiveVehicle$(vehicle.id).subscribe({
      next: () => {
        this.kpisStore.refresh();
        this.notify.success('assets.fleet.vehicles.archivedSnack', { code: vehicle.code });
      },
      error: (err: { status?: number }) => {
        this.notify.error(
          err?.status === 409
            ? 'assets.fleet.vehicles.archiveHasDevice'
            : 'assets.fleet.vehicles.archiveError',
        );
      },
    });
  }
}
