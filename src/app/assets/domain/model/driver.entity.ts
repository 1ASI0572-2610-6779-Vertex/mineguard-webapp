import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { DriverShiftStatus } from './driver-shift-status';

/**
 * Operational driver surfaced by the "Directorio de Conductores" supervisor tab.
 */
export class Driver implements BaseEntity {
  private _id: number;
  private _fullName: string;
  private _operatorId: string;
  private _license: string;
  private _specialty: string;
  private _shiftStatus: DriverShiftStatus;
  private _lastAccess: string;

  constructor(props: {
    id: number;
    fullName: string;
    operatorId: string;
    license: string;
    specialty: string;
    shiftStatus: DriverShiftStatus;
    lastAccess: string;
  }) {
    this._id = props.id;
    this._fullName = props.fullName;
    this._operatorId = props.operatorId;
    this._license = props.license;
    this._specialty = props.specialty;
    this._shiftStatus = props.shiftStatus;
    this._lastAccess = props.lastAccess;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get fullName(): string {
    return this._fullName;
  }

  set fullName(value: string) {
    this._fullName = value;
  }

  get operatorId(): string {
    return this._operatorId;
  }

  set operatorId(value: string) {
    this._operatorId = value;
  }

  get license(): string {
    return this._license;
  }

  set license(value: string) {
    this._license = value;
  }

  get specialty(): string {
    return this._specialty;
  }

  set specialty(value: string) {
    this._specialty = value;
  }

  get shiftStatus(): DriverShiftStatus {
    return this._shiftStatus;
  }

  set shiftStatus(value: DriverShiftStatus) {
    this._shiftStatus = value;
  }

  get lastAccess(): string {
    return this._lastAccess;
  }

  set lastAccess(value: string) {
    this._lastAccess = value;
  }
}
