import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardSummary } from '../domain/model/dashboard-summary.entity';
import { DashboardSummaryResource, DashboardSummaryResponse } from './dashboard-summary-response';

/**
 * Maps the tenant `CompanyKpisResource` onto the {@link DashboardSummary} entity
 * the control-center dashboard renders. Read-only projection: KPIs are never
 * written back, so {@link toResourceFromEntity} is a best-effort inverse.
 */
export class DashboardSummaryAssembler
  implements BaseAssembler<DashboardSummary, DashboardSummaryResource, DashboardSummaryResponse>
{
  toEntitiesFromResponse(_: DashboardSummaryResponse): DashboardSummary[] {
    return [];
  }

  toEntityFromResource(resource: DashboardSummaryResource): DashboardSummary {
    return new DashboardSummary({
      id: resource.companyId,
      activeSensors: resource.activeSensors,
      totalSensors: resource.totalSensors,
      criticalAlerts: resource.criticalAlerts,
      fatigueEvents: resource.fatigueEvents,
      activeVehicles: resource.vehiclesOperational,
      totalDrivers: resource.driversTotal,
    });
  }

  toResourceFromEntity(entity: DashboardSummary): DashboardSummaryResource {
    return {
      id: entity.id,
      companyId: entity.id,
      driversTotal: entity.totalDrivers,
      driversInactive: 0,
      vehiclesTotal: 0,
      vehiclesOperational: entity.activeVehicles,
      vehiclesMaintenance: 0,
      vehiclesAlert: 0,
      vehiclesOperationalPercent: 0,
      supervisorsTotal: 0,
      supervisorsLocked: 0,
      activeSensors: entity.activeSensors,
      totalSensors: entity.totalSensors,
      criticalAlerts: entity.criticalAlerts,
      fatigueEvents: entity.fatigueEvents,
    };
  }
}
