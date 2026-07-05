import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { CompanyKpis } from '../../../shared/domain/model/company-kpis';

/**
 * Aggregated control-center snapshot displayed at the top of the dashboard.
 */
export class DashboardSummary implements BaseEntity {
  id: number;
  activeSensors: number;
  totalSensors: number;
  criticalAlerts: number;
  fatigueEvents: number;
  activeVehicles: number;
  totalDrivers: number;

  constructor(props: {
    id: number;
    activeSensors: number;
    totalSensors: number;
    criticalAlerts: number;
    fatigueEvents: number;
    activeVehicles: number;
    totalDrivers: number;
  }) {
    this.id = props.id;
    this.activeSensors = props.activeSensors;
    this.totalSensors = props.totalSensors;
    this.criticalAlerts = props.criticalAlerts;
    this.fatigueEvents = props.fatigueEvents;
    this.activeVehicles = props.activeVehicles;
    this.totalDrivers = props.totalDrivers;
  }

  /** Projects the shared tenant KPIs onto the dashboard snapshot view model. */
  static fromKpis(kpis: CompanyKpis): DashboardSummary {
    return new DashboardSummary({
      id: kpis.companyId,
      activeSensors: kpis.activeSensors,
      totalSensors: kpis.totalSensors,
      criticalAlerts: kpis.criticalAlerts,
      fatigueEvents: kpis.fatigueEvents,
      activeVehicles: kpis.vehiclesOperational,
      totalDrivers: kpis.driversTotal,
    });
  }
}
