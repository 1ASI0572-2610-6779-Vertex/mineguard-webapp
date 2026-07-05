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
      driverId: resource.driverId,
      tripId: resource.tripId,
      vehicleId: resource.vehicleId,
      fatigueEvents: resource.fatigueEvents,
      alertsCount: resource.alertsCount,
      averageHeartRate: resource.averageHeartRate,
      riskScore: resource.riskScore,
      calculatedAt: resource.calculatedAt,
    });
  }

  toResourceFromEntity(entity: PerformanceMetric): PerformanceMetricResource {
    return {
      id: entity.id,
      driverId: entity.driverId,
      tripId: entity.tripId,
      vehicleId: entity.vehicleId,
      fatigueEvents: entity.fatigueEvents,
      alertsCount: entity.alertsCount,
      averageHeartRate: entity.averageHeartRate,
      riskScore: entity.riskScore,
      calculatedAt: entity.calculatedAt,
    };
  }
}
