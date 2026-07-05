import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { AnalyticsFatigueBar } from '../domain/model/analytics-fatigue-bar.entity';
import { AnalyticsFatigueBarAssembler } from './analytics-fatigue-bar-assembler';
import {
  AnalyticsFatigueBarResource,
  AnalyticsFatigueBarsResponse,
} from './analytics-fatigue-bars-response';

/**
 * HTTP endpoint client for the per-driver fatigue distribution:
 * `GET /companies/{companyId}/metrics/fatigue`.
 */
export class AnalyticsFatigueBarsApiEndpoint extends BaseApiEndpoint<
  AnalyticsFatigueBar,
  AnalyticsFatigueBarResource,
  AnalyticsFatigueBarsResponse,
  AnalyticsFatigueBarAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new AnalyticsFatigueBarAssembler());
  }

  getForCompany(companyId: number): Observable<AnalyticsFatigueBar[]> {
    return this.http
      .get<AnalyticsFatigueBarResource[]>(companyScopedUrl(companyId, environment.platformProviderCompanyFatigueEndpointPath))
      .pipe(
        map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
        catchError(this.handleError('Failed to fetch fatigue distribution')),
      );
  }
}
