import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Hourly aggregation of alerts and incidents used to draw the trend chart.
 */
export class DashboardTrend implements BaseEntity {
  id: number;
  hour: string;
  alerts: number;
  incidents: number;

  constructor(props: { id: number; hour: string; alerts: number; incidents: number }) {
    this.id = props.id;
    this.hour = props.hour;
    this.alerts = props.alerts;
    this.incidents = props.incidents;
  }
}
