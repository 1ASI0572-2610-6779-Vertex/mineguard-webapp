import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { IamStore } from '../../../application/iam.store';
import { CreateSupervisorCommand } from '../../../domain/model/create-supervisor.command';

@Component({
  selector: 'app-supervisor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
  ],
  templateUrl: './supervisor-form.html',
  styleUrl: './supervisor-form.css',
})
export class SupervisorForm extends BaseForm {
  private store = inject(IamStore);
  private dialogRef = inject(MatDialogRef<SupervisorForm>);
  private snackBar = inject(MatSnackBar);

  readonly submitting = signal(false);

  form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    corporateId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get fullNameInvalid(): boolean { return this.isInvalidControl(this.form, 'fullName'); }
  get corporateIdInvalid(): boolean { return this.isInvalidControl(this.form, 'corporateId'); }
  get emailInvalid(): boolean { return this.isInvalidControl(this.form, 'email'); }
  get usernameInvalid(): boolean { return this.isInvalidControl(this.form, 'username'); }
  get passwordInvalid(): boolean { return this.isInvalidControl(this.form, 'password'); }

  get emailErrorMsg(): string {
    const ctrl = this.form.controls.email;
    if (ctrl.hasError('required')) return 'El correo es obligatorio.';
    if (ctrl.hasError('email')) return 'Formato de correo no válido.';
    return '';
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    const command = new CreateSupervisorCommand({
      fullName:    this.form.value.fullName!.trim(),
      corporateId: this.form.value.corporateId!.trim(),
      email:       this.form.value.email!.trim(),
      username:    this.form.value.username!.trim(),
      password:    this.form.value.password!,
      idCompany:   1,
    });

    this.store.createSupervisor(command);
    this.submitting.set(false);
    this.dialogRef.close(true);
    this.snackBar.open('Supervisor creado exitosamente', 'OK', {
      duration: 3500,
      panelClass: ['mg-snack', 'mg-snack--success'],
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
