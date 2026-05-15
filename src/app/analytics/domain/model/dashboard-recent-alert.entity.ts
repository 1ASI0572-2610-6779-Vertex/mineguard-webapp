import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Live alert row shown in the dashboard recent-alerts table.
 */
export class DashboardRecentAlert implements BaseEntity {
  id: number;
  alertCode: string;
  severity: string;
  category: string;
  driverName: string;
  vehicleCode: string;
  vehicleType: string;
  route: string;
  time: string;
  status: string;

  constructor(props: {
    id: number;
    alertCode: string;
    severity: string;
    category: string;
    driverName: string;
    vehicleCode: string;
    vehicleType: string;
    route: string;
    time: string;
    status: string;
  }) {
    this.id = props.id;
    this.alertCode = props.alertCode;
    this.severity = props.severity;
    this.category = props.category;
    this.driverName = props.driverName;
    this.vehicleCode = props.vehicleCode;
    this.vehicleType = props.vehicleType;
    this.route = props.route;
    this.time = props.time;
    this.status = props.status;
  }
}
