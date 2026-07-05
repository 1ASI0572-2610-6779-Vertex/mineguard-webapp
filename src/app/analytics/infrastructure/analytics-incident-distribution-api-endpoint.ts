import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { AnalyticsIncidentDistribution } from '../domain/model/analytics-incident-distribution.entity';
import { AnalyticsIncidentDistributionAssembler } from './analytics-incident-distribution-assembler';
import {
  AnalyticsIncidentDistributionResource,
  AnalyticsIncidentDistributionResponse,
} from './analytics-incident-distribution-response';

/**
 * HTTP endpoint client for the incident-type breakdown:
 * `GET /companies/{companyId}/metrics/incidents`.
 */
export class AnalyticsIncidentDistributionApiEndpoint extends BaseApiEndpoint<
  AnalyticsIncidentDistribution,
  AnalyticsIncidentDistributionResource,
  AnalyticsIncidentDistributionResponse,
  AnalyticsIncidentDistributionAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new AnalyticsIncidentDistributionAssembler());
  }

  getForCompany(companyId: number): Observable<AnalyticsIncidentDistribution[]> {
    return this.http
      .get<AnalyticsIncidentDistributionResource[]>(companyScopedUrl(companyId, environment.platformProviderCompanyIncidentsEndpointPath))
      .pipe(
        map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
        catchError(this.handleError('Failed to fetch incident distribution')),
      );
  }
}
