import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { AssetsStore } from '../../../application/assets.store';
import { Vehicle } from '../../../domain/model/vehicle.entity';
import { VehicleStatus } from '../../../domain/model/vehicle-status';

export interface VehicleDialogData {
  vehicle?: Vehicle;
}

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
  ],
  templateUrl: './vehicle-form-dialog.html',
  styleUrl: './vehicle-form-dialog.css',
})
export class VehicleFormDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<VehicleFormDialog>);
  private store = inject(AssetsStore);
  readonly data: VehicleDialogData = inject(MAT_DIALOG_DATA) ?? {};

  readonly isEdit = !!this.data.vehicle;
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly statusOptions: { value: VehicleStatus; label: string }[] = [
    { value: 'operational',     label: 'Operativo' },
    { value: 'maintenance',     label: 'En Mantenimiento' },
    { value: 'alert',           label: 'En Alerta' },
    { value: 'inactive',        label: 'Inactivo' },
    { value: 'restricted_route', label: 'Ruta Restringida' },
  ];

  form = this.fb.nonNullable.group({
    code:               [this.data.vehicle?.code              ?? '', Validators.required],
    model:              [this.data.vehicle?.model             ?? '', Validators.required],
    category:           [this.data.vehicle?.category          ?? '', Validators.required],
    status:             [this.data.vehicle?.status            ?? ('operational' as VehicleStatus), Validators.required],
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
      next:  (saved) => { this.loading.set(false); this.dialogRef.close(saved); },
      error: (err)   => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Error al guardar el vehículo'); },
    });
  }

  cancel(): void { this.dialogRef.close(); }
}
