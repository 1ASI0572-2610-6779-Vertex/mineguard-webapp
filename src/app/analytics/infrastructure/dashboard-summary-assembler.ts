import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardSummary } from '../domain/model/dashboard-summary.entity';
import { DashboardSummaryResource, DashboardSummaryResponse } from './dashboard-summary-response';

export class DashboardSummaryAssembler
  implements BaseAssembler<DashboardSummary, DashboardSummaryResource, DashboardSummaryResponse>
{
  toEntitiesFromResponse(_: DashboardSummaryResponse): DashboardSummary[] {
    return [];
  }

  toEntityFromResource(resource: DashboardSummaryResource): DashboardSummary {
    return new DashboardSummary({
      id: resource.id,
      activeSensors: resource.activeSensors,
      totalSensors: resource.totalSensors,
      criticalAlerts: resource.criticalAlerts,
      fatigueEvents: resource.fatigueEvents,
      activeVehicles: resource.activeVehicles,
      totalDrivers: resource.totalDrivers,
    });
  }

  toResourceFromEntity(entity: DashboardSummary): DashboardSummaryResource {
    return {
      id: entity.id,
      activeSensors: entity.activeSensors,
      totalSensors: entity.totalSensors,
      criticalAlerts: entity.criticalAlerts,
      fatigueEvents: entity.fatigueEvents,
      activeVehicles: entity.activeVehicles,
      totalDrivers: entity.totalDrivers,
    };
  }
}
