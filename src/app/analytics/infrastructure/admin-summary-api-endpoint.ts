import { HttpClient } from '@angular/common/http';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AdminSummary } from '../domain/model/admin-summary.entity';
import { AdminSummaryAssembler } from './admin-summary-assembler';
import { AdminSummaryResource, AdminSummaryResponse } from './admin-summary-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAdminSummaryEndpointPath}`;

/**
 * HTTP endpoint client for admin summary KPIs.
 */
export class AdminSummaryApiEndpoint extends BaseApiEndpoint<
  AdminSummary,
  AdminSummaryResource,
  AdminSummaryResponse,
  AdminSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new AdminSummaryAssembler());
  }
}
