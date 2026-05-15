import { BaseEntity } from '../../../shared/domain/model/base-entity';

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
}
