/**
 * Subscription plan tiers accepted by the backend when registering a new company.
 *
 * @remarks
 * Purely descriptive on the backend — it does not impose node or user limits.
 * Defaults to `STANDARD` server-side when omitted.
 */
export type SubscriptionPlan = 'STARTER' | 'STANDARD' | 'ENTERPRISE';

/**
 * HTTP request payload for company (tenant) registration.
 *
 * @remarks
 * Infrastructure-level wire contract for `POST /api/v1/companies`. No JWT is
 * required — this is the entry point for brand-new clients. The backend resolves
 * every other identifier (companyId, apiKey, admin username) server-side.
 */
export interface CompanyRegistrationRequest {
  /** Legal / commercial name of the mining company being registered. */
  companyName: string;
  /** Full name of the administrator account owner. */
  adminFullName: string;
  /** Administrator email (valid format). Temporary credentials are sent here. */
  adminEmail: string;
  /** Optional descriptive plan. Backend assigns `STANDARD` when omitted. */
  subscriptionPlan?: SubscriptionPlan;
}
