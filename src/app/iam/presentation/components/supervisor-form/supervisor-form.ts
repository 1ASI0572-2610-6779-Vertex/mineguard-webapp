import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { IamStore } from '../../../application/iam.store';
import { CreateSupervisorCommand } from '../../../domain/model/create-supervisor.command';

/**
 * "Nuevo Supervisor" form card for the admin user-management view.
 *
 * @remarks
 * Collects the three identity fields required to provision a new supervisor
 * account. The system generates a temporary password on creation and forces
 * a change on first login (per the helper text in the wireframe), so the
 * form intentionally has no password input.
 */
@Component({
  selector: 'app-supervisor-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButton, MatIcon, TranslatePipe],
  templateUrl: './supervisor-form.html',
  styleUrl: './supervisor-form.css',
})
export class SupervisorForm extends BaseForm {
  private store = inject(IamStore);

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
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const command = new CreateSupervisorCommand({
      fullName: this.form.value.fullName!.trim(),
      corporateId: this.form.value.corporateId!.trim(),
      email: this.form.value.email!.trim(),
    });
    this.store.createSupervisor(command);
    this.form.reset();
  }
}
