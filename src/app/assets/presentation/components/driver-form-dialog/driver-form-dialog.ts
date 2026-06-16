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
import { Driver } from '../../../domain/model/driver.entity';
import { DriverShiftStatus } from '../../../domain/model/driver-shift-status';

export interface DriverDialogData {
  driver?: Driver;
}

@Component({
  selector: 'app-driver-form-dialog',
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
  templateUrl: './driver-form-dialog.html',
  styleUrl: './driver-form-dialog.css',
})
export class DriverFormDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DriverFormDialog>);
  private store = inject(AssetsStore);
  readonly data: DriverDialogData = inject(MAT_DIALOG_DATA) ?? {};

  readonly isEdit = !!this.data.driver;
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly shiftStatusOptions: { value: DriverShiftStatus; label: string }[] = [
    { value: 'on_shift',  label: 'En turno' },
    { value: 'off_shift', label: 'Fuera de turno' },
    { value: 'inactive',  label: 'Inactivo' },
  ];

  form = this.fb.nonNullable.group({
    fullName:    [this.data.driver?.fullName    ?? '', Validators.required],
    operatorId:  [this.data.driver?.operatorId  ?? '', Validators.required],
    license:     [this.data.driver?.license     ?? '', Validators.required],
    specialty:   [this.data.driver?.specialty   ?? '', Validators.required],
    shiftStatus: [this.data.driver?.shiftStatus ?? ('on_shift' as DriverShiftStatus), Validators.required],
    lastAccess:  [this.data.driver?.lastAccess  ?? ''],
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();
    const driver = new Driver({
      id:          this.data.driver?.id ?? 0,
      fullName:    v.fullName,
      operatorId:  v.operatorId,
      license:     v.license,
      specialty:   v.specialty,
      shiftStatus: v.shiftStatus,
      lastAccess:  v.lastAccess || new Date().toLocaleDateString('es-PE'),
    });

    this.loading.set(true);
    this.errorMsg.set(null);

    const call$ = this.isEdit ? this.store.updateDriver$(driver) : this.store.createDriver$(driver);

    call$.subscribe({
      next:  (saved) => { this.loading.set(false); this.dialogRef.close(saved); },
      error: (err)   => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Error al guardar el conductor'); },
    });
  }

  cancel(): void { this.dialogRef.close(); }
}
