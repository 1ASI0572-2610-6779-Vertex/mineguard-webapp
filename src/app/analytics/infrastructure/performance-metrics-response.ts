import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * `PerformanceMetricResource` as returned by `GET /drivers/{driverId}/metrics`.
 * Camel-case per the platform contract. `tripId` is retained by the contract
 * (the persistence model still keys metrics by trip/session id).
 */
export interface PerformanceMetricResource extends BaseResource {
  id: number;
  driverId: number;
  tripId: number;
  vehicleId: number;
  fatigueEvents: number;
  alertsCount: number;
  averageHeartRate: number;
  riskScore: number;
  calculatedAt: string;
}

export interface PerformanceMetricsResponse extends BaseResponse {}
