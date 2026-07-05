import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { AnalyticsInsight } from '../domain/model/analytics-insight.entity';
import { AnalyticsInsightAssembler } from './analytics-insight-assembler';
import {
  AnalyticsInsightResource,
  AnalyticsInsightsResponse,
} from './analytics-insights-response';

/**
 * HTTP endpoint client for the pre-computed natural-language insights:
 * `GET /companies/{companyId}/insights`.
 */
export class AnalyticsInsightsApiEndpoint extends BaseApiEndpoint<
  AnalyticsInsight,
  AnalyticsInsightResource,
  AnalyticsInsightsResponse,
  AnalyticsInsightAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new AnalyticsInsightAssembler());
  }

  getForCompany(companyId: number): Observable<AnalyticsInsight[]> {
    return this.http
      .get<AnalyticsInsightResource[]>(companyScopedUrl(companyId, environment.platformProviderCompanyInsightsEndpointPath))
      .pipe(
        map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
        catchError(this.handleError('Failed to fetch insights')),
      );
  }
}
