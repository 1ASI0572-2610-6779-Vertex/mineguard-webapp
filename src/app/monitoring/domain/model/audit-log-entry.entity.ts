import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { AuditCategory } from './audit-category';

/**
 * Single entry in the system audit log surfaced by the
 * "Auditoría y Activos" admin view.
 *
 * @remarks
 * The title, description and actor are stored as i18n keys + parameters so
 * the presentation layer renders them in the active locale without the
 * backend shipping pre-translated strings.
 */
export class AuditLogEntry implements BaseEntity {
  private _id: number;
  private _category: AuditCategory;
  private _occurredAt: string;
  private _titleKey: string;
  private _descriptionKey: string;
  private _descriptionParams: Record<string, unknown>;
  private _actorKey: string;

  constructor(props: {
    id: number;
    category: AuditCategory;
    occurredAt: string;
    titleKey: string;
    descriptionKey: string;
    descriptionParams: Record<string, unknown>;
    actorKey: string;
  }) {
    this._id = props.id;
    this._category = props.category;
    this._occurredAt = props.occurredAt;
    this._titleKey = props.titleKey;
    this._descriptionKey = props.descriptionKey;
    this._descriptionParams = props.descriptionParams;
    this._actorKey = props.actorKey;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get category(): AuditCategory {
    return this._category;
  }

  set category(value: AuditCategory) {
    this._category = value;
  }

  get occurredAt(): string {
    return this._occurredAt;
  }

  set occurredAt(value: string) {
    this._occurredAt = value;
  }

  get titleKey(): string {
    return this._titleKey;
  }

  set titleKey(value: string) {
    this._titleKey = value;
  }

  get descriptionKey(): string {
    return this._descriptionKey;
  }

  set descriptionKey(value: string) {
    this._descriptionKey = value;
  }

  get descriptionParams(): Record<string, unknown> {
    return this._descriptionParams;
  }

  set descriptionParams(value: Record<string, unknown>) {
    this._descriptionParams = value;
  }

  get actorKey(): string {
    return this._actorKey;
  }

  set actorKey(value: string) {
    this._actorKey = value;
  }
}
