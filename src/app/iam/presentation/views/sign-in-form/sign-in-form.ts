import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';
import { SignInCommand } from '../../../domain/model/sign-in.command';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './sign-in-form.html',
  styleUrls:   ['../auth-shell.css', './sign-in-form.css'],
})
export class SignInForm extends BaseForm implements OnInit {
  private readonly router    = inject(Router);
  private readonly store     = inject(IamStore);
  private readonly translate = inject(TranslateService);

  readonly submitting   = signal(false);
  readonly hidePassword = signal(true);
  readonly currentLang  = signal<'es' | 'en'>(
    (localStorage.getItem('mineguard.lang') as 'es' | 'en') ?? 'es',
  );

  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    if (this.store.isSignedIn()) {
      const dest = this.store.currentRole() === 'Administrator'
        ? '/analytics/admin-summary'
        : '/analytics/dashboard';
      this.router.navigate([dest]).then();
    }
  }

  switchLang(lang: 'es' | 'en'): void {
    if (lang === this.currentLang()) return;
    this.translate.use(lang).subscribe();
    localStorage.setItem('mineguard.lang', lang);
    this.currentLang.set(lang);
  }

  performSignIn(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.store.signIn(
      new SignInCommand({
        username: this.form.getRawValue().username,
        password: this.form.getRawValue().password,
      }),
      this.router,
    );
  }
}
