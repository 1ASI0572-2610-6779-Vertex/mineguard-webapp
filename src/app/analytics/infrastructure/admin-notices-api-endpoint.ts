import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { AdminNotice } from '../domain/model/admin-notice.entity';
import { AdminNoticeAssembler } from './admin-notice-assembler';
import { AdminNoticeResource, AdminNoticesResponse } from './admin-notice-response';

/**
 * HTTP endpoint client for tenant admin notices:
 * `GET /companies/{companyId}/notices` (wrapper `{ notices: [...] }`) and
 * `POST /companies/{companyId}/notices/{noticeId}/dispatches`.
 */
export class AdminNoticesApiEndpoint extends BaseApiEndpoint<
  AdminNotice,
  AdminNoticeResource,
  AdminNoticesResponse,
  AdminNoticeAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new AdminNoticeAssembler());
  }

  getForCompany(companyId: number): Observable<AdminNotice[]> {
    return this.http
      .get<AdminNoticesResponse>(companyScopedUrl(companyId, environment.platformProviderCompanyNoticesEndpointPath))
      .pipe(
        map((response) => this.assembler.toEntitiesFromResponse(response)),
        catchError(this.handleError('Failed to fetch admin notices')),
      );
  }

  postDispatch(companyId: number, noticeId: number): Observable<void> {
    const url = `${companyScopedUrl(companyId, environment.platformProviderCompanyNoticesEndpointPath)}/${noticeId}/dispatches`;
    return this.http
      .post<void>(url, {})
      .pipe(catchError(this.handleError(`Failed to dispatch notice ${noticeId}`)));
  }
}
