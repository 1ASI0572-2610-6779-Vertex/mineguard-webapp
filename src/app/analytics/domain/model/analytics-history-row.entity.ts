import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Historical incident row displayed in the analytics history table.
 */
export class AnalyticsHistoryRow implements BaseEntity {
  id: number;
  date: string;
  time: string;
  criticality: string;
  criticalityLabel: string;
  incidentType: string;
  involved: string;
  location: string;

  constructor(props: {
    id: number;
    date: string;
    time: string;
    criticality: string;
    criticalityLabel: string;
    incidentType: string;
    involved: string;
    location: string;
  }) {
    this.id = props.id;
    this.date = props.date;
    this.time = props.time;
    this.criticality = props.criticality;
    this.criticalityLabel = props.criticalityLabel;
    this.incidentType = props.incidentType;
    this.involved = props.involved;
    this.location = props.location;
  }
}
