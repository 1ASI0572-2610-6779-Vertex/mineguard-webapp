import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { VehicleStatus } from './vehicle-status';

/**
 * Operational vehicle surfaced by the "Inventario de Vehículos" supervisor tab.
 */
export class Vehicle implements BaseEntity {
  private _id: number;
  private _code: string;
  private _model: string;
  private _category: string;
  private _status: VehicleStatus;
  private _assignedDriverName: string | null;
  private _shiftLabel: string | null;

  constructor(props: {
    id: number;
    code: string;
    model: string;
    category: string;
    status: VehicleStatus;
    assignedDriverName: string | null;
    shiftLabel: string | null;
  }) {
    this._id = props.id;
    this._code = props.code;
    this._model = props.model;
    this._category = props.category;
    this._status = props.status;
    this._assignedDriverName = props.assignedDriverName;
    this._shiftLabel = props.shiftLabel;
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

  get model(): string {
    return this._model;
  }

  set model(value: string) {
    this._model = value;
  }

  get category(): string {
    return this._category;
  }

  set category(value: string) {
    this._category = value;
  }

  get status(): VehicleStatus {
    return this._status;
  }

  set status(value: VehicleStatus) {
    this._status = value;
  }

  get assignedDriverName(): string | null {
    return this._assignedDriverName;
  }

  set assignedDriverName(value: string | null) {
    this._assignedDriverName = value;
  }

  get shiftLabel(): string | null {
    return this._shiftLabel;
  }

  set shiftLabel(value: string | null) {
    this._shiftLabel = value;
  }
}
