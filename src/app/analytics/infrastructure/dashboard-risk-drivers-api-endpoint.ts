import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DashboardRiskDriver } from '../domain/model/dashboard-risk-driver.entity';
import { DashboardRiskDriversAssembler } from './dashboard-risk-drivers-assembler';
import {
  DashboardRiskDriverResource,
  DashboardRiskDriversResponse,
} from './dashboard-risk-drivers-response';

export class DashboardRiskDriversApiEndpoint extends BaseApiEndpoint<
  DashboardRiskDriver,
  DashboardRiskDriverResource,
  DashboardRiskDriversResponse,
  DashboardRiskDriversAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderDashboardRiskDriversEndpointPath}`,
      new DashboardRiskDriversAssembler()
    );
  }
}
