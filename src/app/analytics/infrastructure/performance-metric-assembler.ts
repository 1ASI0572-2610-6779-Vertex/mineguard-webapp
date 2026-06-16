import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { PerformanceMetric } from '../domain/model/performance-metric.entity';
import {
  PerformanceMetricResource,
  PerformanceMetricsResponse,
} from './performance-metrics-response';

export class PerformanceMetricAssembler
  implements BaseAssembler<PerformanceMetric, PerformanceMetricResource, PerformanceMetricsResponse>
{
  toEntitiesFromResponse(_: PerformanceMetricsResponse): PerformanceMetric[] {
    return [];
  }

  toEntityFromResource(resource: PerformanceMetricResource): PerformanceMetric {
    return new PerformanceMetric({
      id: resource.id,
      driverId: resource.id_driver,
      tripId: resource.id_trip,
      vehicleId: resource.id_vehicle,
      fatigueEvents: resource.fatigue_events,
      alertsCount: resource.alerts_count,
      averageHeartRate: resource.average_heart_rate,
      riskScore: resource.risk_score,
      calculatedAt: resource.calculated_at,
    });
  }

  toResourceFromEntity(entity: PerformanceMetric): PerformanceMetricResource {
    return {
      id: entity.id,
      id_driver: entity.driverId,
      id_trip: entity.tripId,
      id_vehicle: entity.vehicleId,
      fatigue_events: entity.fatigueEvents,
      alerts_count: entity.alertsCount,
      average_heart_rate: entity.averageHeartRate,
      risk_score: entity.riskScore,
      calculated_at: entity.calculatedAt,
    };
  }
}
