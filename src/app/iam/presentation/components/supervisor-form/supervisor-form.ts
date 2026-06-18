import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { IamStore } from '../../../application/iam.store';
import { CreateSupervisorCommand } from '../../../domain/model/create-supervisor.command';

@Component({
  selector: 'app-supervisor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './supervisor-form.html',
  styleUrl:    './supervisor-form.css',
})
export class SupervisorForm extends BaseForm {
  private readonly store     = inject(IamStore);
  private readonly dialogRef = inject(MatDialogRef<SupervisorForm>);
  private readonly snackBar  = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  readonly submitting = signal(false);

  readonly form = new FormGroup({
    fullName:    new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    corporateId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email:       new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  get fullNameInvalid():    boolean { return this.isInvalidControl(this.form, 'fullName'); }
  get corporateIdInvalid(): boolean { return this.isInvalidControl(this.form, 'corporateId'); }
  get emailInvalid():       boolean { return this.isInvalidControl(this.form, 'email'); }

  get emailErrorKey(): string {
    const ctrl = this.form.controls.email;
    if (ctrl.hasError('required')) return 'iam.supervisors.newSupervisor.email.required';
    if (ctrl.hasError('email'))    return 'iam.supervisors.newSupervisor.email.invalid';
    return '';
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    const v = this.form.getRawValue();
    const command = new CreateSupervisorCommand({
      fullName:    v.fullName.trim(),
      corporateId: v.corporateId.trim(),
      email:       v.email.trim(),
      idCompany:   1,
    });

    this.store.createSupervisor(command);
    this.submitting.set(false);
    this.dialogRef.close(true);
    this.snackBar.open(
      this.translate.instant('iam.supervisors.newSupervisor.successSnack'),
      'OK',
      { duration: 5000, panelClass: ['mg-snack', 'mg-snack--success'] },
    );
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
