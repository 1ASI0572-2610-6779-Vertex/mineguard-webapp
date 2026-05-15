import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { AlertPriority } from './alert-priority';
import { AlertStatus } from './alert-status';
import { AlertType } from './alert-type';

/**
 * Operational alert surfaced by the supervisor "Gestión de Alertas" view.
 *
 * @remarks
 * Carries enough information to render both the inbox list card and the
 * detail panel: type/priority for color-coding, code for the big header,
 * title/description for the body, vehicle + driver identifiers for the
 * affected unit block, and resolution notes for the classification flow.
 */
export class Alert implements BaseEntity {
  private _id: number;
  private _code: string;
  private _type: AlertType;
  private _priority: AlertPriority;
  private _status: AlertStatus;
  private _occurredAt: string;
  private _title: string;
  private _description: string;
  private _vehicleClassKey: string;
  private _vehicleCode: string;
  private _driverName: string;
  private _resolutionNotes: string;

  constructor(props: {
    id: number;
    code: string;
    type: AlertType;
    priority: AlertPriority;
    status: AlertStatus;
    occurredAt: string;
    title: string;
    description: string;
    vehicleClassKey: string;
    vehicleCode: string;
    driverName: string;
    resolutionNotes: string;
  }) {
    this._id = props.id;
    this._code = props.code;
    this._type = props.type;
    this._priority = props.priority;
    this._status = props.status;
    this._occurredAt = props.occurredAt;
    this._title = props.title;
    this._description = props.description;
    this._vehicleClassKey = props.vehicleClassKey;
    this._vehicleCode = props.vehicleCode;
    this._driverName = props.driverName;
    this._resolutionNotes = props.resolutionNotes;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }

  get type(): AlertType {
    return this._type;
  }

  set type(value: AlertType) {
    this._type = value;
  }

  get priority(): AlertPriority {
    return this._priority;
  }

  set priority(value: AlertPriority) {
    this._priority = value;
  }

  get status(): AlertStatus {
    return this._status;
  }

  set status(value: AlertStatus) {
    this._status = value;
  }

  get occurredAt(): string {
    return this._occurredAt;
  }

  set occurredAt(value: string) {
    this._occurredAt = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get vehicleClassKey(): string {
    return this._vehicleClassKey;
  }

  set vehicleClassKey(value: string) {
    this._vehicleClassKey = value;
  }

  get vehicleCode(): string {
    return this._vehicleCode;
  }

  set vehicleCode(value: string) {
    this._vehicleCode = value;
  }

  get driverName(): string {
    return this._driverName;
  }

  set driverName(value: string) {
    this._driverName = value;
  }

  get resolutionNotes(): string {
    return this._resolutionNotes;
  }

  set resolutionNotes(value: string) {
    this._resolutionNotes = value;
  }
}
