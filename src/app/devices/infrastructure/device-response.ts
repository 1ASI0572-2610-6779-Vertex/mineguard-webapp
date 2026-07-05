import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Wire shape of a device as returned by GET/POST /api/v1/sensors.
 *
 * Example (201 response):
 * `{ "id": 1, "vehicleId": 1, "sensorType": "MineGuard Device", "deviceId": "1", "status": "active", "companyId": 1 }`
 */
export interface DeviceResource extends BaseResource {
  id: number;
  vehicleId: number;
  sensorType: string;
  deviceId: string;
  status: string;
  companyId: number;
}

export interface DevicesResponse extends BaseResponse {}
