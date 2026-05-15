import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Slice of the incident-distribution chart in the analytics view.
 */
export class AnalyticsIncidentDistribution implements BaseEntity {
  id: number;
  label: string;
  count: number;
  percent: number;
  className: string;

  constructor(props: { id: number; label: string; count: number; percent: number; className: string }) {
    this.id = props.id;
    this.label = props.label;
    this.count = props.count;
    this.percent = props.percent;
    this.className = props.className;
  }
}
