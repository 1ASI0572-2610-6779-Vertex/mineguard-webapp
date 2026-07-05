import { BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Structured response returned by `POST /api/v1/companies` on success (`201`).
 *
 * @remarks
 * The backend performs the tenant onboarding atomically: it creates the
 * `Company`, provisions the ADMIN user, emails a temporary password, generates a
 * per-company telemetry API key, and activates the subscription. The generated
 * identifiers are returned here so the client can consume them programmatically
 * instead of parsing free text.
 */
export interface CompanyRegistrationResource {
  /** Unique numeric identifier assigned to the newly created tenant. */
  companyId: number;
  /** Per-company telemetry API key. Must be stored to configure edge devices. */
  apiKey: string;
  /** Auto-generated username for the administrator account (e.g. `admin-42-01`). */
  adminUsername: string;
  /** Human-readable confirmation message (also references the email destination). */
  message: string;
}

/**
 * Response envelope for company registration.
 */
export interface CompanyRegistrationResponse
  extends BaseResponse,
    CompanyRegistrationResource {}
