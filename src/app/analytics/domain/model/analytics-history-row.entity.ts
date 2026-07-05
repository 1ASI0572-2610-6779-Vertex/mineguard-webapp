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
  /** Owning driver of the incident; null when there is no associated trip. */
  driverId: number | null;
  /** Report id for this incident; null when no report has been generated. */
  reportId: number | null;

  constructor(props: {
    id: number;
    date: string;
    time: string;
    criticality: string;
    criticalityLabel: string;
    incidentType: string;
    involved: string;
    location: string;
    driverId?: number | null;
    reportId?: number | null;
  }) {
    this.id = props.id;
    this.date = props.date;
    this.time = props.time;
    this.criticality = props.criticality;
    this.criticalityLabel = props.criticalityLabel;
    this.incidentType = props.incidentType;
    this.involved = props.involved;
    this.location = props.location;
    this.driverId = props.driverId ?? null;
    this.reportId = props.reportId ?? null;
  }
}
