import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { VehicleOperationalStatus } from './vehicle-operational-status';

/**
 * Vehicle position surfaced on the supervisor "Mapa Operativo en Vivo" view.
 *
 * @remarks
 * Coordinates are stored as decimal degrees (lat, lng). Marker color is
 * driven by {@link status}.
 */
export class LiveMapVehicle implements BaseEntity {
  private _id: number;
  private _code: string;
  private _vehicleType: string;
  private _latitude: number;
  private _longitude: number;
  private _status: VehicleOperationalStatus;
  private _driverName: string;
  private _activeTripId: number | null;

  constructor(props: {
    id: number;
    code: string;
    vehicleType: string;
    latitude: number;
    longitude: number;
    status: VehicleOperationalStatus;
    driverName: string;
    activeTripId: number | null;
  }) {
    this._id = props.id;
    this._code = props.code;
    this._vehicleType = props.vehicleType;
    this._latitude = props.latitude;
    this._longitude = props.longitude;
    this._status = props.status;
    this._driverName = props.driverName;
    this._activeTripId = props.activeTripId;
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

  get vehicleType(): string {
    return this._vehicleType;
  }

  set vehicleType(value: string) {
    this._vehicleType = value;
  }

  get latitude(): number {
    return this._latitude;
  }

  set latitude(value: number) {
    this._latitude = value;
  }

  get longitude(): number {
    return this._longitude;
  }

  set longitude(value: number) {
    this._longitude = value;
  }

  get status(): VehicleOperationalStatus {
    return this._status;
  }

  set status(value: VehicleOperationalStatus) {
    this._status = value;
  }

  get driverName(): string {
    return this._driverName;
  }

  set driverName(value: string) {
    this._driverName = value;
  }

  get activeTripId(): number | null {
    return this._activeTripId;
  }

  set activeTripId(value: number | null) {
    this._activeTripId = value;
  }
}
