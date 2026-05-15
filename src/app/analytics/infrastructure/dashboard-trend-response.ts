import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DashboardTrendResource extends BaseResource {
  id: number;
  hour: string;
  alerts: number;
  incidents: number;
}

export interface DashboardTrendResponse extends BaseResponse {
  dashboardTrend: DashboardTrendResource[];
}
