import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Driver ranked by accumulated risk score within the dashboard view.
 */
export class DashboardRiskDriver implements BaseEntity {
  id: number;
  driverId: number;
  driverName: string;
  vehicleType: string;
  riskScore: number;

  constructor(props: {
    id: number;
    driverId: number;
    driverName: string;
    vehicleType: string;
    riskScore: number;
  }) {
    this.id = props.id;
    this.driverId = props.driverId;
    this.driverName = props.driverName;
    this.vehicleType = props.vehicleType;
    this.riskScore = props.riskScore;
  }
}
