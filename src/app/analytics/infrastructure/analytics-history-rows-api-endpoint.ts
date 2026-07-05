import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { AnalyticsHistoryRow } from '../domain/model/analytics-history-row.entity';
import { AnalyticsHistoryRowAssembler } from './analytics-history-row-assembler';
import {
  AnalyticsHistoryRowResource,
  AnalyticsHistoryRowsResponse,
} from './analytics-history-rows-response';

/** Minimal Spring Data `Page<T>` envelope — only the fields the client reads. */
interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/**
 * HTTP endpoint client for the analytics history:
 * `GET /companies/{companyId}/history?page=&size=` — **pagination is mandatory**
 * (this collection grows unbounded), so the response is a Spring Data page.
 */
export class AnalyticsHistoryRowsApiEndpoint extends BaseApiEndpoint<
  AnalyticsHistoryRow,
  AnalyticsHistoryRowResource,
  AnalyticsHistoryRowsResponse,
  AnalyticsHistoryRowAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new AnalyticsHistoryRowAssembler());
  }

  getForCompany(companyId: number, page = 0, size = 20): Observable<AnalyticsHistoryRow[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http
      .get<SpringPage<AnalyticsHistoryRowResource>>(
        companyScopedUrl(companyId, environment.platformProviderCompanyHistoryEndpointPath),
        { params },
      )
      .pipe(
        map((pageResp) => (pageResp.content ?? []).map((r) => this.assembler.toEntityFromResource(r))),
        catchError(this.handleError('Failed to fetch analytics history')),
      );
  }
}
