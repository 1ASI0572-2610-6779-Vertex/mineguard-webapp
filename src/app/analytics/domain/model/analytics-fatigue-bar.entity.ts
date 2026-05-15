import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Visual representation of fatigue events per driver in the analytics view.
 */
export class AnalyticsFatigueBar implements BaseEntity {
  id: number;
  driverId: number;
  driverName: string;
  fatigueEvents: number;
  width: number;

  constructor(props: {
    id: number;
    driverId: number;
    driverName: string;
    fatigueEvents: number;
    width: number;
  }) {
    this.id = props.id;
    this.driverId = props.driverId;
    this.driverName = props.driverName;
    this.fatigueEvents = props.fatigueEvents;
    this.width = props.width;
  }
}
