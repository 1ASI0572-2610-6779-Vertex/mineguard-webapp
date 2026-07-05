import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { DashboardTrend } from '../domain/model/dashboard-trend.entity';
import { DashboardTrendAssembler } from './dashboard-trend-assembler';
import { DashboardTrendResource, DashboardTrendResponse } from './dashboard-trend-response';

/**
 * HTTP endpoint client for the alerts/incidents trend series:
 * `GET /companies/{companyId}/metrics/alerts-trend`.
 */
export class DashboardTrendApiEndpoint extends BaseApiEndpoint<
  DashboardTrend,
  DashboardTrendResource,
  DashboardTrendResponse,
  DashboardTrendAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new DashboardTrendAssembler());
  }

  getForCompany(companyId: number): Observable<DashboardTrend[]> {
    return this.http
      .get<DashboardTrendResource[]>(companyScopedUrl(companyId, environment.platformProviderCompanyAlertsTrendEndpointPath))
      .pipe(
        map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
        catchError(this.handleError('Failed to fetch alerts trend')),
      );
  }
}
