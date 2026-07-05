/**
 * Consolidated tenant KPIs (`GET /companies/{companyId}/kpis`).
 *
 * @remarks
 * Single source of truth for every read-only counter the app renders across
 * bounded contexts: the control-center dashboard, the assets catalog summary and
 * the live-map fleet summary all project a subset of these fields. Fetched once
 * and cached by {@link CompanyKpisStore}; each context derives its own view model
 * via a `fromKpis(...)` factory.
 */
export class CompanyKpis {
  readonly companyId: number;
  readonly driversTotal: number;
  readonly driversInactive: number;
  readonly vehiclesTotal: number;
  readonly vehiclesOperational: number;
  readonly vehiclesMaintenance: number;
  readonly vehiclesAlert: number;
  readonly vehiclesOperationalPercent: number;
  readonly supervisorsTotal: number;
  readonly supervisorsLocked: number;
  readonly activeSensors: number;
  readonly totalSensors: number;
  readonly criticalAlerts: number;
  readonly fatigueEvents: number;

  constructor(props: {
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
  }) {
    this.companyId = props.companyId;
    this.driversTotal = props.driversTotal;
    this.driversInactive = props.driversInactive;
    this.vehiclesTotal = props.vehiclesTotal;
    this.vehiclesOperational = props.vehiclesOperational;
    this.vehiclesMaintenance = props.vehiclesMaintenance;
    this.vehiclesAlert = props.vehiclesAlert;
    this.vehiclesOperationalPercent = props.vehiclesOperationalPercent;
    this.supervisorsTotal = props.supervisorsTotal;
    this.supervisorsLocked = props.supervisorsLocked;
    this.activeSensors = props.activeSensors;
    this.totalSensors = props.totalSensors;
    this.criticalAlerts = props.criticalAlerts;
    this.fatigueEvents = props.fatigueEvents;
  }
}
