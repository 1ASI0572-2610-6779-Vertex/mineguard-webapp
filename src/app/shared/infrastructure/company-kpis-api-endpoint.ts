import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CompanyKpis } from '../domain/model/company-kpis';
import { CompanyKpisAssembler } from './company-kpis-assembler';
import { CompanyKpisResource } from './company-kpis-response';
import { ErrorHandlingEnabledBaseType } from './error-handling-enabled-base-type';
import { companyScopedUrl } from './company-scoped-url';

/**
 * Single HTTP client for the consolidated tenant KPIs
 * (`GET /companies/{companyId}/kpis`). Injectable so {@link CompanyKpisStore}
 * can depend on it directly; it is the one place that talks to the KPIs endpoint.
 */
@Injectable({ providedIn: 'root' })
export class CompanyKpisApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new CompanyKpisAssembler();

  constructor(private http: HttpClient) {
    super();
  }

  getForCompany(companyId: number): Observable<CompanyKpis> {
    return this.http
      .get<CompanyKpisResource>(companyScopedUrl(companyId, environment.platformProviderCompanyKpisEndpointPath))
      .pipe(
        map((resource) => this.assembler.toModelFromResource(resource)),
        catchError(this.handleError('Failed to fetch company KPIs')),
      );
  }
}
