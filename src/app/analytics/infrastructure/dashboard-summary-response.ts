import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Company KPIs resource returned by `GET /companies/{companyId}/kpis`
 * (`CompanyKpisResource`). Consolidated fleet/catalog/safety counters for the
 * authenticated tenant. Mapped down to the {@link DashboardSummary} entity that
 * the control-center dashboard already consumes.
 */
export interface DashboardSummaryResource extends BaseResource {
  companyId: number;
  driversTotal: number;
  driversInactive: number;
  vehiclesTotal: number;
  vehiclesOperational: number;
  vehiclesMaintenance: number;
  vehiclesAlert: number;
  vehiclesOperationalPercent: number;
  supervisorsTotal: number;
  supervisorsLocked: number;
  activeSensors: number;
  totalSensors: number;
  criticalAlerts: number;
  fatigueEvents: number;
}

export interface DashboardSummaryResponse extends BaseResponse {}
