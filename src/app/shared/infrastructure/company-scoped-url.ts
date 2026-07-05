import { environment } from '../../../environments/environment';

/**
 * Base URL for the tenant-scoped resource tree: `.../api/v1/companies`.
 */
export const companiesBaseUrl =
  `${environment.platformProviderApiBaseUrl}${environment.platformProviderCompaniesEndpointPath}`;

/**
 * Builds a tenant-scoped URL of the form
 * `.../api/v1/companies/{companyId}{suffix}`.
 *
 * @remarks
 * Every read endpoint under `/companies/{companyId}/...` validates that the path
 * `companyId` matches the JWT tenant, so the value must come from the
 * authenticated session (`IamStore.currentCompanyId()`), never from user input.
 *
 * @param companyId - Tenant id resolved from the current session.
 * @param suffix - Path suffix beginning with `/` (e.g. `/kpis`, `/metrics/fatigue`).
 */
export function companyScopedUrl(companyId: number, suffix: string): string {
  return `${companiesBaseUrl}/${companyId}${suffix}`;
}
