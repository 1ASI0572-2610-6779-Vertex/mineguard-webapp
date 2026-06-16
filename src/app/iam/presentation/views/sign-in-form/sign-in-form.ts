import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';
import { SignInCommand } from '../../../domain/model/sign-in.command';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';

/**
 * Collects credentials and triggers IAM sign-in.
 *
 * @remarks
 * Redirects to `/home` immediately if the user is already authenticated, so
 * the sign-in form does not show up to a user with an active session.
 */
@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    TranslatePipe,
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css',
})
export class SignInForm extends BaseForm implements OnInit {
  private router = inject(Router);
  private store = inject(IamStore);

  /**
   * Form-group for the sign-in form.
   */
  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    if (this.store.isSignedIn()) {
      const dest = this.store.currentRole() === 'Administrator' ? '/analytics/admin-summary' : '/analytics/dashboard';
      this.router.navigate([dest]).then();
    }
  }

  /**
   * Performs the sign-in operation if the form is valid.
   */
  performSignIn(): void {
    if (this.form.invalid) return;
    const command = new SignInCommand({
      username: this.form.value.username!,
      password: this.form.value.password!,
    });
    this.store.signIn(command, this.router);
  }
}
