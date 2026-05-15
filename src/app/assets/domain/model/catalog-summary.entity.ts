import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Aggregated catalog counts surfaced by the admin "Auditoría y Activos" view.
 *
 * @remarks
 * Each metric (drivers, vehicles, supervisors) is paired with a contextual
 * sub-count (inactive, in maintenance, locked) so the widget can show both
 * the total and the most relevant attention indicator at a glance.
 */
export class CatalogSummary implements BaseEntity {
  private _id: number;
  private _driversTotal: number;
  private _driversInactive: number;
  private _vehiclesTotal: number;
  private _vehiclesMaintenance: number;
  private _supervisorsTotal: number;
  private _supervisorsLocked: number;

  constructor(props: {
    id: number;
    driversTotal: number;
    driversInactive: number;
    vehiclesTotal: number;
    vehiclesMaintenance: number;
    supervisorsTotal: number;
    supervisorsLocked: number;
  }) {
    this._id = props.id;
    this._driversTotal = props.driversTotal;
    this._driversInactive = props.driversInactive;
    this._vehiclesTotal = props.vehiclesTotal;
    this._vehiclesMaintenance = props.vehiclesMaintenance;
    this._supervisorsTotal = props.supervisorsTotal;
    this._supervisorsLocked = props.supervisorsLocked;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get driversTotal(): number {
    return this._driversTotal;
  }

  set driversTotal(value: number) {
    this._driversTotal = value;
  }

  get driversInactive(): number {
    return this._driversInactive;
  }

  set driversInactive(value: number) {
    this._driversInactive = value;
  }

  get vehiclesTotal(): number {
    return this._vehiclesTotal;
  }

  set vehiclesTotal(value: number) {
    this._vehiclesTotal = value;
  }

  get vehiclesMaintenance(): number {
    return this._vehiclesMaintenance;
  }

  set vehiclesMaintenance(value: number) {
    this._vehiclesMaintenance = value;
  }

  get supervisorsTotal(): number {
    return this._supervisorsTotal;
  }

  set supervisorsTotal(value: number) {
    this._supervisorsTotal = value;
  }

  get supervisorsLocked(): number {
    return this._supervisorsLocked;
  }

  set supervisorsLocked(value: number) {
    this._supervisorsLocked = value;
  }
}
