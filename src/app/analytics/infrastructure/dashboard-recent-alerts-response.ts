import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DashboardRecentAlertResource extends BaseResource {
  id: number;
  alertCode: string;
  severity: string;
  category: string;
  driverName: string;
  vehicleCode: string;
  vehicleType: string;
  route: string;
  time: string;
  status: string;
}

export interface DashboardRecentAlertsResponse extends BaseResponse {
  dashboardRecentAlerts: DashboardRecentAlertResource[];
}
