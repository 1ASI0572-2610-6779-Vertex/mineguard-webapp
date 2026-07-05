import { CompanyKpis } from '../domain/model/company-kpis';
import { CompanyKpisResource } from './company-kpis-response';

/**
 * Converts the `CompanyKpisResource` wire DTO into the {@link CompanyKpis}
 * domain model consumed by {@link CompanyKpisStore}.
 */
export class CompanyKpisAssembler {
  toModelFromResource(resource: CompanyKpisResource): CompanyKpis {
    return new CompanyKpis({
      companyId: resource.companyId,
      driversTotal: resource.driversTotal,
      driversInactive: resource.driversInactive,
      vehiclesTotal: resource.vehiclesTotal,
      vehiclesOperational: resource.vehiclesOperational,
      vehiclesMaintenance: resource.vehiclesMaintenance,
      vehiclesAlert: resource.vehiclesAlert,
      vehiclesOperationalPercent: resource.vehiclesOperationalPercent,
      supervisorsTotal: resource.supervisorsTotal,
      supervisorsLocked: resource.supervisorsLocked,
      activeSensors: resource.activeSensors,
      totalSensors: resource.totalSensors,
      criticalAlerts: resource.criticalAlerts,
      fatigueEvents: resource.fatigueEvents,
    });
  }
}
