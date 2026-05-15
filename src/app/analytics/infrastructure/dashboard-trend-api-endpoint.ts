import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DashboardTrend } from '../domain/model/dashboard-trend.entity';
import { DashboardTrendAssembler } from './dashboard-trend-assembler';
import { DashboardTrendResource, DashboardTrendResponse } from './dashboard-trend-response';

export class DashboardTrendApiEndpoint extends BaseApiEndpoint<
  DashboardTrend,
  DashboardTrendResource,
  DashboardTrendResponse,
  DashboardTrendAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderDashboardTrendEndpointPath}`,
      new DashboardTrendAssembler()
    );
  }
}
