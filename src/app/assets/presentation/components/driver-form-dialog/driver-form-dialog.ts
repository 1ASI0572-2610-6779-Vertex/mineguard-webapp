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
import { SaveDriverCommand } from '../../../domain/model/save-driver.command';

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

  readonly workShiftOptions = [
    { value: 'Morning', label: 'Mañana' },
    { value: 'Afternoon', label: 'Tarde' },
    { value: 'Night', label: 'Noche' },
  ];

  form = this.fb.nonNullable.group({
    fullName:      [this.data.driver?.fullName ?? '', Validators.required],
    username:      ['', Validators.required],
    password:      ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
    email:         ['', [Validators.required, Validators.email]],
    licenseNumber: [this.data.driver?.license ?? '', Validators.required],
    workShift:     ['Morning', Validators.required],
    idCompany:     [1, Validators.required],
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();
    const command = new SaveDriverCommand({
      id:            this.data.driver?.id,
      fullName:      v.fullName,
      username:      v.username,
      password:      v.password,
      email:         v.email,
      licenseNumber: v.licenseNumber,
      workShift:     v.workShift,
      idCompany:     v.idCompany,
    });

    this.loading.set(true);
    this.errorMsg.set(null);

    const call$ = this.isEdit
      ? this.store.updateDriver$(command)
      : this.store.createDriver$(command);

    call$.subscribe({
      next:  (saved) => { this.loading.set(false); this.dialogRef.close(saved); },
      error: (err)   => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Error al guardar el conductor'); },
    });
  }

  cancel(): void { this.dialogRef.close(); }
}
