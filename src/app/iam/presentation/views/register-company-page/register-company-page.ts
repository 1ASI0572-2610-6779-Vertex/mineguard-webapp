import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';
import { RegisterCompanyCommand } from '../../../domain/model/register-company.command';
import { CompanyRegistrationResponse } from '../../../infrastructure/company-registration-response';
import { SubscriptionPlan } from '../../../infrastructure/company-registration.request';

interface PlanOption {
  readonly key: SubscriptionPlan;
  readonly nameKey: string;
  readonly descKey: string;
  readonly price: string;
  /** i18n keys for the "what's included" feature list, revealed on demand. */
  readonly featureKeys: readonly string[];
}

/**
 * Public "Register your company" view.
 *
 * @remarks
 * Renders without the app shell (see Layout.NO_SHELL_ROUTES). Collects the tenant
 * onboarding fields, POSTs them to `/api/v1/companies` (no JWT), and on success
 * swaps the form for a credentials screen surfacing the generated `adminUsername`
 * and telemetry `apiKey`. A `409` is surfaced as a distinct duplicate-conflict
 * banner; the user is never redirected automatically on success.
 */
@Component({
  selector: 'app-register-company-page',
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
  templateUrl: './register-company-page.html',
  styleUrls: ['../auth-shell.css', './register-company-page.css'],
})
export class RegisterCompanyPage {
  private readonly store = inject(IamStore);
  private readonly router = inject(Router);

  readonly plans: readonly PlanOption[] = [
    {
      key: 'STARTER',
      nameKey: 'iam.registerCompany.plans.starter.name',
      descKey: 'iam.registerCompany.plans.starter.desc',
      price: '$250',
      featureKeys: [
        'iam.registerCompany.plans.starter.features.f1',
        'iam.registerCompany.plans.starter.features.f2',
        'iam.registerCompany.plans.starter.features.f3',
        'iam.registerCompany.plans.starter.features.f4',
      ],
    },
    {
      key: 'STANDARD',
      nameKey: 'iam.registerCompany.plans.standard.name',
      descKey: 'iam.registerCompany.plans.standard.desc',
      price: '$499',
      featureKeys: [
        'iam.registerCompany.plans.standard.features.f1',
        'iam.registerCompany.plans.standard.features.f2',
        'iam.registerCompany.plans.standard.features.f3',
        'iam.registerCompany.plans.standard.features.f4',
      ],
    },
    {
      key: 'ENTERPRISE',
      nameKey: 'iam.registerCompany.plans.enterprise.name',
      descKey: 'iam.registerCompany.plans.enterprise.desc',
      price: '$899',
      featureKeys: [
        'iam.registerCompany.plans.enterprise.features.f1',
        'iam.registerCompany.plans.enterprise.features.f2',
        'iam.registerCompany.plans.enterprise.features.f3',
        'iam.registerCompany.plans.enterprise.features.f4',
      ],
    },
  ];

  /** Key of the plan whose feature list is currently expanded (null = all collapsed). */
  readonly expandedPlan = signal<SubscriptionPlan | null>(null);

  toggleFeatures(plan: SubscriptionPlan, event: Event): void {
    // Prevent the card's (click)=selectPlan from also firing when toggling info.
    event.stopPropagation();
    this.expandedPlan.update((current) => (current === plan ? null : plan));
  }

  readonly submitting = signal(false);
  /** Inline API error message key (409 conflict or generic). Null when no error. */
  readonly errorKey = signal<string | null>(null);
  /** Populated on 201 — drives the success screen. Null while the form is shown. */
  readonly result = signal<CompanyRegistrationResponse | null>(null);
  readonly apiKeyCopied = signal(false);

  readonly form = new FormGroup({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    adminFullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    adminEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    subscriptionPlan: new FormControl<SubscriptionPlan>('STANDARD', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  selectPlan(plan: SubscriptionPlan): void {
    this.form.controls.subscriptionPlan.setValue(plan);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorKey.set(null);
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    this.store
      .registerCompany(
        new RegisterCompanyCommand({
          companyName: raw.companyName,
          adminFullName: raw.adminFullName,
          adminEmail: raw.adminEmail,
          subscriptionPlan: raw.subscriptionPlan,
        }),
      )
      .subscribe({
        next: (response) => {
          this.submitting.set(false);
          this.result.set(response);
          // Bridge registration data to the sidebar: the sign-in endpoint does
          // not echo the admin's name or company, so remember them locally keyed
          // by the generated admin username.
          this.store.rememberProfile(response.adminUsername, raw.adminFullName, raw.companyName);
        },
        error: (err: { status?: number }) => {
          this.submitting.set(false);
          this.errorKey.set(
            err?.status === 409
              ? 'iam.registerCompany.errors.conflict'
              : 'iam.registerCompany.errors.generic',
          );
        },
      });
  }

  copyApiKey(): void {
    const key = this.result()?.apiKey;
    if (!key) return;
    navigator.clipboard?.writeText(key).then(
      () => {
        this.apiKeyCopied.set(true);
        setTimeout(() => this.apiKeyCopied.set(false), 2000);
      },
      () => {},
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']).then();
  }
}
