import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DashboardSummaryResource extends BaseResource {
  id: number;
  activeSensors: number;
  totalSensors: number;
  criticalAlerts: number;
  fatigueEvents: number;
  activeVehicles: number;
  totalDrivers: number;
}

export interface DashboardSummaryResponse extends BaseResponse {
  dashboardSummary: DashboardSummaryResource[];
}
