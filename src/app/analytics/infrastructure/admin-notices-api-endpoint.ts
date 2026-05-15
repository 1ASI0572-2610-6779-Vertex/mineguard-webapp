import { HttpClient } from '@angular/common/http';

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
}
