import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Generated report associated with an incident, alert and user.
 */
export class Report implements BaseEntity {
  id: number;
  incidentId: number;
  alertId: number;
  userId: number;
  metricId: number;
  reportType: string;
  createdAt: string;
  description: string;

  constructor(props: {
    id: number;
    incidentId: number;
    alertId: number;
    userId: number;
    metricId: number;
    reportType: string;
    createdAt: string;
    description: string;
  }) {
    this.id = props.id;
    this.incidentId = props.incidentId;
    this.alertId = props.alertId;
    this.userId = props.userId;
    this.metricId = props.metricId;
    this.reportType = props.reportType;
    this.createdAt = props.createdAt;
    this.description = props.description;
  }
}
