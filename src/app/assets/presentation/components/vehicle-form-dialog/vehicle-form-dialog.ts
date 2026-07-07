import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { Vehicle } from '../../../domain/model/vehicle.entity';
import { VehicleStatus } from '../../../domain/model/vehicle-status';
import { Device } from '../../../../devices/domain/model/device.entity';
import { DeviceRegistrationError, DevicesStore } from '../../../../devices/application/devices.store';
import { CompanyKpisStore } from '../../../../shared/application/company-kpis.store';
import { NotificationService } from '../../../../shared/presentation/services/notification.service';

export interface VehicleDialogData {
  vehicle?: Vehicle;
}

/** Result handed back to the opener when the dialog closes. */
export interface VehicleDialogResult {
  vehicle: Vehicle;
  /** The device linked in the same flow, when the supervisor opted to link one. */
  device?: Device;
}

/**
 * Create/edit a vehicle and, on creation, link its MineGuard device in the same
 * step (supervisor flow).
 *
 * @remarks
 * Creation is a **two-call, non-atomic** sequence: `POST /vehicles` then
 * `POST /vehicles/{id}/sensor`. The vehicle is committed first; if the device
 * link fails, the vehicle is kept and the dialog switches to a **focused retry**
 * that only re-attempts the link (the URL already carries the vehicle id), so
 * nothing is re-captured and no orphan is silently created. The device's
 * `deviceId` is assigned server-side (sequential integer) — never entered here.
 */
@Component({
  selector: 'app-vehicle-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    TranslatePipe,
  ],
  templateUrl: './vehicle-form-dialog.html',
  styleUrl: './vehicle-form-dialog.css',
})
export class VehicleFormDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<VehicleFormDialog, VehicleDialogResult | Vehicle>);
  private store = inject(AssetsStore);
  private devicesStore = inject(DevicesStore);
  private kpisStore = inject(CompanyKpisStore);
  private notify = inject(NotificationService);
  private translate = inject(TranslateService);
  readonly data: VehicleDialogData = inject(MAT_DIALOG_DATA) ?? {};

  readonly isEdit = !!this.data.vehicle;
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  /** When true (create only), a device is linked right after the vehicle is saved. */
  readonly linkDeviceNow = signal(true);

  /** Set once the vehicle is persisted; drives the focused device-retry state. */
  readonly committedVehicle = signal<Vehicle | null>(null);
  /** Device-link failure (null while pending or on success) — shown in the retry panel. */
  readonly linkError = signal<DeviceRegistrationError | null>(null);

  /**
   * True when the vehicle is committed but its device is not linked yet — the
   * dialog then shows the focused retry panel instead of the vehicle form.
   */
  readonly awaitingDeviceLink = computed(() => this.committedVehicle() !== null);

  // Labels are i18n keys resolved with the `translate` pipe in the template.
  readonly statusOptions: { value: VehicleStatus; label: string }[] = [
    { value: 'available',   label: 'assets.fleet.vehicles.status.available' },
    { value: 'in_use',      label: 'assets.fleet.vehicles.status.inUse' },
    { value: 'maintenance', label: 'assets.fleet.vehicles.status.maintenance' },
  ];

  form = this.fb.nonNullable.group({
    code:               [this.data.vehicle?.code              ?? '', Validators.required],
    model:              [this.data.vehicle?.model             ?? '', Validators.required],
    category:           [this.data.vehicle?.category          ?? '', Validators.required],
    status:             [this.data.vehicle?.status            ?? ('available' as VehicleStatus), Validators.required],
    assignedDriverName: [this.data.vehicle?.assignedDriverName ?? ''],
    shiftLabel:         [this.data.vehicle?.shiftLabel        ?? ''],
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();
    const vehicle = new Vehicle({
      id:                 this.data.vehicle?.id ?? 0,
      code:               v.code,
      model:              v.model,
      category:           v.category,
      status:             v.status,
      assignedDriverName: v.assignedDriverName || null,
      shiftLabel:         v.shiftLabel || null,
    });

    this.loading.set(true);
    this.errorMsg.set(null);

    const call$ = this.isEdit ? this.store.updateVehicle$(vehicle) : this.store.createVehicle$(vehicle);

    call$.subscribe({
      next: (saved) => {
        // Edit, or create-without-linking: we're done.
        if (this.isEdit || !this.linkDeviceNow()) {
          this.loading.set(false);
          this.dialogRef.close({ vehicle: saved });
          return;
        }
        // Create + link: the vehicle is now committed; proceed to the device step.
        this.committedVehicle.set(saved);
        this.linkDevice(saved);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.message ?? this.translate.instant('assets.fleet.vehicles.form.saveError'));
      },
    });
  }

  /** Re-attempts only the device link for the already-committed vehicle. */
  retryLink(): void {
    const vehicle = this.committedVehicle();
    if (vehicle) this.linkDevice(vehicle);
  }

  /**
   * Closes the dialog. If the vehicle was committed but its device never linked,
   * still returns the vehicle so the list reflects it (as "sin device").
   */
  cancel(): void {
    const committed = this.committedVehicle();
    this.dialogRef.close(committed ? { vehicle: committed } : undefined);
  }

  /** Human-readable message for the link-failure panel. */
  linkErrorMessage(err: DeviceRegistrationError): string {
    return err.backendMessage?.trim() || this.translate.instant(err.key);
  }

  private linkDevice(vehicle: Vehicle): void {
    this.loading.set(true);
    this.linkError.set(null);
    this.devicesStore.linkDevice$(vehicle.id).subscribe({
      next: (device) => {
        this.loading.set(false);
        // The toolbar sensor counter is derived from tenant KPIs — refresh it.
        this.kpisStore.refresh();
        this.notify.success('assets.fleet.vehicles.form.device.linkedSnack', {
          id: device.deviceId,
          code: vehicle.code,
        });
        this.dialogRef.close({ vehicle, device });
      },
      error: (err: DeviceRegistrationError) => {
        this.loading.set(false);
        this.linkError.set(err);
      },
    });
  }
}
