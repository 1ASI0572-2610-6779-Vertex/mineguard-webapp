import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface DashboardRiskDriverResource extends BaseResource {
  id: number;
  driverId: number;
  driverName: string;
  vehicleType: string;
  riskScore: number;
}

export interface DashboardRiskDriversResponse extends BaseResponse {}
