import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * A MineGuard edge device: a single unit mounted on one vehicle that already
 * integrates the four sensors (GPS, heart-rate, anti-collision ultrasound and
 * collision). The admin never registers sensors individually — a device is
 * bound 1:1 to a vehicle via its {@link deviceId}.
 *
 * @remarks
 * The backend models a device as a "sensor" resource, so `sensorType` is always
 * `"MineGuard Device"`. The tenant (`companyId`) is resolved server-side from the JWT.
 */
export class Device implements BaseEntity {
  private readonly _id: number;
  private readonly _vehicleId: number;
  private readonly _sensorType: string;
  private readonly _deviceId: string;
  private readonly _status: string;
  private readonly _companyId: number;

  constructor(props: {
    id: number;
    vehicleId: number;
    sensorType: string;
    deviceId: string;
    status: string;
    companyId: number;
  }) {
    this._id = props.id;
    this._vehicleId = props.vehicleId;
    this._sensorType = props.sensorType;
    this._deviceId = props.deviceId;
    this._status = props.status;
    this._companyId = props.companyId;
  }

  get id(): number {
    return this._id;
  }

  get vehicleId(): number {
    return this._vehicleId;
  }

  get sensorType(): string {
    return this._sensorType;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get status(): string {
    return this._status;
  }

  get companyId(): number {
    return this._companyId;
  }
}
