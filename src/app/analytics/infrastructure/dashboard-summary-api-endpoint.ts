import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { DashboardSummary } from '../domain/model/dashboard-summary.entity';
import { DashboardSummaryAssembler } from './dashboard-summary-assembler';
import {
  DashboardSummaryResource,
  DashboardSummaryResponse,
} from './dashboard-summary-response';

/**
 * HTTP endpoint client for the tenant KPIs consumed by the control-center
 * dashboard: `GET /companies/{companyId}/kpis`. Returns a single resource.
 */
export class DashboardSummaryApiEndpoint extends BaseApiEndpoint<
  DashboardSummary,
  DashboardSummaryResource,
  DashboardSummaryResponse,
  DashboardSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new DashboardSummaryAssembler());
  }

  getForCompany(companyId: number): Observable<DashboardSummary> {
    return this.http
      .get<DashboardSummaryResource>(companyScopedUrl(companyId, environment.platformProviderCompanyKpisEndpointPath))
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to fetch company KPIs')),
      );
  }
}
