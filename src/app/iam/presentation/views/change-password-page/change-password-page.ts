import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';

const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pw  = group.get('newPassword')?.value ?? '';
  const cpw = group.get('confirmPassword')?.value ?? '';
  return pw === cpw ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './change-password-page.html',
  styleUrls:   ['../auth-shell.css', './change-password-page.css'],
})
export class ChangePasswordPage {
  private readonly store     = inject(IamStore);
  private readonly router    = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly submitting  = signal(false);
  readonly errorMsg    = signal<string | null>(null);
  readonly hideNew     = signal(true);
  readonly hideConfirm = signal(true);

  readonly form = new FormGroup(
    {
      newPassword:     new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: passwordsMatchValidator },
  );

  get mismatch(): boolean {
    return this.form.hasError('passwordsMismatch') && this.form.controls.confirmPassword.touched;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.errorMsg.set(null);
    this.store.changePassword(this.form.getRawValue().newPassword).subscribe({
      next: () => {
        this.router.navigate([this.store.postChangePasswordDestination()]).then();
      },
      error: (err: Error) => {
        this.submitting.set(false);
        this.errorMsg.set(
          err.message || this.translate.instant('iam.changePassword.errorGeneric'),
        );
      },
    });
  }
}
