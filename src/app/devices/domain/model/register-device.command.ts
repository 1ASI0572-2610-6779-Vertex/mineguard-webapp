/**
 * Command encapsulating the two fields required to register a MineGuard device
 * via POST /api/v1/sensors.
 *
 * @remarks
 * `companyId` is resolved server-side from the JWT and is **never** sent from the
 * UI. `sensorType` is fixed server-side to `"MineGuard Device"`. The admin only
 * links one vehicle (`vehicleId`) with one physical unit (`deviceId`).
 */
export class RegisterDeviceCommand {
  readonly vehicleId: number;
  readonly deviceId: string;

  constructor(props: { vehicleId: number; deviceId: string }) {
    this.vehicleId = props.vehicleId;
    this.deviceId = props.deviceId;
  }
}
