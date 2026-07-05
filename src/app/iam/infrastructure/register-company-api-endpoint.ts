import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RegisterCompanyCommand } from '../domain/model/register-company.command';
import { CompanyRegistrationRequest } from './company-registration.request';
import { CompanyRegistrationResponse } from './company-registration-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCompaniesEndpointPath}`;

/**
 * Error thrown by {@link RegisterCompanyApiEndpoint} that preserves the HTTP
 * status code, so callers can branch on `409 Conflict` (duplicate company/email)
 * without inspecting the raw `HttpErrorResponse`.
 */
export class CompanyRegistrationError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'CompanyRegistrationError';
  }
}

/**
 * HTTP endpoint client for company (tenant) registration.
 *
 * @remarks
 * Calls `POST /api/v1/companies`. This endpoint requires **no JWT** — it is the
 * public onboarding entry point for new clients. Unlike the other IAM endpoints
 * it does not collapse errors into a generic message: it rethrows a
 * {@link CompanyRegistrationError} carrying the status so the `409` conflict can
 * be surfaced distinctly in the UI.
 */
export class RegisterCompanyApiEndpoint {
  constructor(private http: HttpClient) {}

  register(command: RegisterCompanyCommand): Observable<CompanyRegistrationResponse> {
    const request: CompanyRegistrationRequest = {
      companyName: command.companyName,
      adminFullName: command.adminFullName,
      adminEmail: command.adminEmail,
      subscriptionPlan: command.subscriptionPlan,
    };

    return this.http.post<CompanyRegistrationResponse>(endpointUrl, request).pipe(
      catchError((error: HttpErrorResponse) =>
        throwError(() => new CompanyRegistrationError(error.message, error.status)),
      ),
    );
  }
}
