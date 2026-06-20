import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AdminNotice } from '../domain/model/admin-notice.entity';
import { AdminNoticeAssembler } from './admin-notice-assembler';
import { AdminNoticeResource, AdminNoticesResponse } from './admin-notice-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAdminNoticesEndpointPath}`;

/**
 * HTTP endpoint client for admin notices.
 */
export class AdminNoticesApiEndpoint extends BaseApiEndpoint<
  AdminNotice,
  AdminNoticeResource,
  AdminNoticesResponse,
  AdminNoticeAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new AdminNoticeAssembler());
  }

  // POST /api/v1/admin/notices/{noticeId}/dispatches
  postDispatch(noticeId: number): Observable<void> {
    return this.http.post<void>(`${endpointUrl}/${noticeId}/dispatches`, {}).pipe(
      catchError(this.handleError(`Failed to dispatch notice ${noticeId}`)),
    );
  }
}
