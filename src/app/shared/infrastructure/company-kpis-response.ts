/**
 * Canonical `CompanyKpisResource` returned by `GET /companies/{companyId}/kpis`.
 *
 * @remarks
 * Consolidated fleet/catalog/safety counters for the authenticated tenant. This
 * single resource is the source of truth for several read-only widgets across
 * bounded contexts (dashboard KPIs, catalog summary, fleet summary), each of
 * which projects the subset of fields it renders. Shared here so those contexts
 * map from one contract definition instead of duplicating it.
 */
export interface CompanyKpisResource {
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
