import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AnalyticsFatigueBarResource extends BaseResource {
  id: number;
  driverId: number;
  driverName: string;
  fatigueEvents: number;
  width: number;
}

export interface AnalyticsFatigueBarsResponse extends BaseResponse {}
