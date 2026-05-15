import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DashboardSummary } from '../domain/model/dashboard-summary.entity';
import { DashboardSummaryAssembler } from './dashboard-summary-assembler';
import {
  DashboardSummaryResource,
  DashboardSummaryResponse,
} from './dashboard-summary-response';

export class DashboardSummaryApiEndpoint extends BaseApiEndpoint<
  DashboardSummary,
  DashboardSummaryResource,
  DashboardSummaryResponse,
  DashboardSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderDashboardSummaryEndpointPath}`,
      new DashboardSummaryAssembler()
    );
  }
}
