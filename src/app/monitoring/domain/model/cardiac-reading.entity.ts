import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { CardiacStatus } from './cardiac-status';

/**
 * Heart-rate reading for a driver, surfaced in the
 * "Monitoreo Cardiaco" widget of the live-map view.
 */
export class CardiacReading implements BaseEntity {
  private _id: number;
  private _driverName: string;
  private _vehicleCode: string;
  private _heartRate: number;
  private _status: CardiacStatus;

  constructor(props: {
    id: number;
    driverName: string;
    vehicleCode: string;
    heartRate: number;
    status: CardiacStatus;
  }) {
    this._id = props.id;
    this._driverName = props.driverName;
    this._vehicleCode = props.vehicleCode;
    this._heartRate = props.heartRate;
    this._status = props.status;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get driverName(): string {
    return this._driverName;
  }

  set driverName(value: string) {
    this._driverName = value;
  }

  get vehicleCode(): string {
    return this._vehicleCode;
  }

  set vehicleCode(value: string) {
    this._vehicleCode = value;
  }

  get heartRate(): number {
    return this._heartRate;
  }

  set heartRate(value: number) {
    this._heartRate = value;
  }

  get status(): CardiacStatus {
    return this._status;
  }

  set status(value: CardiacStatus) {
    this._status = value;
  }
}
