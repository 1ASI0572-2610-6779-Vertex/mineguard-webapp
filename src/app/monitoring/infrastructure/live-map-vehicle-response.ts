import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { VehicleOperationalStatus } from '../domain/model/vehicle-operational-status';

export interface LiveMapVehicleResource extends BaseResource {
  id: number;
  code: string;
  vehicleType: string;
  latitude: number;
  longitude: number;
  status: VehicleOperationalStatus;
  driverName: string;
}

export interface LiveMapVehiclesResponse extends BaseResponse {
  vehicles: LiveMapVehicleResource[];
}
