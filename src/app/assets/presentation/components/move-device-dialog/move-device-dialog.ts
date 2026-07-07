import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { Vehicle } from '../../../domain/model/vehicle.entity';
import { DeviceRegistrationError, DevicesStore } from '../../../../devices/application/devices.store';
import { CompanyKpisStore } from '../../../../shared/application/company-kpis.store';
import { NotificationService } from '../../../../shared/presentation/services/notification.service';

export interface MoveDeviceDialogData {
  /** The vehicle whose device is being moved (carries the display deviceId). */
  source: Vehicle;
  /** Candidate destinations — vehicles without a device (source excluded). */
  candidates: Vehicle[];
}

/**
 * Moves a device from one vehicle to another, preserving its sequential id.
 *
 * @remarks
 * The target list is restricted to vehicles that have no device, so the common
 * `409` ("target already has a device") is avoided up-front; the backend remains
 * the final guard against a concurrent race.
 */
@Component({
  selector: 'app-move-device-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TranslatePipe,
  ],
  templateUrl: './move-device-dialog.html',
  styleUrl: './move-device-dialog.css',
})
export class MoveDeviceDialog {
  private dialogRef = inject(MatDialogRef<MoveDeviceDialog, boolean>);
  private devicesStore = inject(DevicesStore);
  private assetsStore = inject(AssetsStore);
  private kpisStore = inject(CompanyKpisStore);
  private notify = inject(NotificationService);
  private translate = inject(TranslateService);
  readonly data: MoveDeviceDialogData = inject(MAT_DIALOG_DATA);

  readonly targetId = signal<number | null>(null);
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  confirm(): void {
    const target = this.targetId();
    if (target == null || this.loading()) return;

    this.loading.set(true);
    this.errorMsg.set(null);
    this.devicesStore.moveDeviceByVehicle$(this.data.source.id, target).subscribe({
      next: (device) => {
        this.loading.set(false);
        const targetCode = this.data.candidates.find((v) => v.id === target)?.code ?? '';
        this.assetsStore.loadVehicles();
        this.kpisStore.refresh();
        this.notify.success('assets.fleet.vehicles.moveDialog.movedSnack', {
          id: device.deviceId,
          code: targetCode,
        });
        this.dialogRef.close(true);
      },
      error: (err: DeviceRegistrationError) => {
        this.loading.set(false);
        this.errorMsg.set(err.backendMessage?.trim() || this.translate.instant(err.key));
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
