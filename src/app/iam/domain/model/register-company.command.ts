import { SubscriptionPlan } from '../../infrastructure/company-registration.request';

/**
 * Domain command representing the intent to register a new mining company (tenant).
 *
 * @remarks
 * In DDD this is the immutable input to the company onboarding flow. It is kept
 * separate from the HTTP request contract so the API wire format can evolve
 * without touching the domain. `subscriptionPlan` is optional and defaults to
 * `STANDARD` when the backend receives no value.
 */
export class RegisterCompanyCommand {
  readonly companyName: string;
  readonly adminFullName: string;
  readonly adminEmail: string;
  readonly subscriptionPlan: SubscriptionPlan;

  constructor(params: {
    companyName: string;
    adminFullName: string;
    adminEmail: string;
    subscriptionPlan?: SubscriptionPlan;
  }) {
    this.companyName = params.companyName;
    this.adminFullName = params.adminFullName;
    this.adminEmail = params.adminEmail;
    this.subscriptionPlan = params.subscriptionPlan ?? 'STANDARD';
  }
}
