import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Per-trip performance metric computed for a driver and vehicle.
 */
export class PerformanceMetric implements BaseEntity {
  id: number;
  driverId: number;
  tripId: number;
  vehicleId: number;
  fatigueEvents: number;
  alertsCount: number;
  averageHeartRate: number;
  riskScore: number;
  calculatedAt: string;

  constructor(props: {
    id: number;
    driverId: number;
    tripId: number;
    vehicleId: number;
    fatigueEvents: number;
    alertsCount: number;
    averageHeartRate: number;
    riskScore: number;
    calculatedAt: string;
  }) {
    this.id = props.id;
    this.driverId = props.driverId;
    this.tripId = props.tripId;
    this.vehicleId = props.vehicleId;
    this.fatigueEvents = props.fatigueEvents;
    this.alertsCount = props.alertsCount;
    this.averageHeartRate = props.averageHeartRate;
    this.riskScore = props.riskScore;
    this.calculatedAt = props.calculatedAt;
  }
}
