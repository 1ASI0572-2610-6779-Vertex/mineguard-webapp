import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Editorial highlight rendered in the analytics insights panel.
 */
export class AnalyticsInsight implements BaseEntity {
  id: number;
  title: string;
  description: string;
  className: string;

  constructor(props: { id: number; title: string; description: string; className: string }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.className = props.className;
  }
}
