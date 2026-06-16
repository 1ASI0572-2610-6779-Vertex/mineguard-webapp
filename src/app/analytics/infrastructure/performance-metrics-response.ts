import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PerformanceMetricResource extends BaseResource {
  id: number;
  id_driver: number;
  id_trip: number;
  id_vehicle: number;
  fatigue_events: number;
  alerts_count: number;
  average_heart_rate: number;
  risk_score: number;
  calculated_at: string;
}

export interface PerformanceMetricsResponse extends BaseResponse {}
