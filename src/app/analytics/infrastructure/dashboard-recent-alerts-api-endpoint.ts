import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DashboardRecentAlert } from '../domain/model/dashboard-recent-alert.entity';
import { DashboardRecentAlertsAssembler } from './dashboard-recent-alerts-assembler';
import {
  DashboardRecentAlertResource,
  DashboardRecentAlertsResponse,
} from './dashboard-recent-alerts-response';

export class DashboardRecentAlertsApiEndpoint extends BaseApiEndpoint<
  DashboardRecentAlert,
  DashboardRecentAlertResource,
  DashboardRecentAlertsResponse,
  DashboardRecentAlertsAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderDashboardRecentAlertsEndpointPath}`,
      new DashboardRecentAlertsAssembler()
    );
  }
}
