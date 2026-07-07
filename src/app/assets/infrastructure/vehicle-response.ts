import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { VehicleStatus } from '../domain/model/vehicle-status';

export interface VehicleResource extends BaseResource {
  id: number;
  code: string;
  model: string;
  category: string;
  status: VehicleStatus;
  assignedDriverName: string | null;
  shiftLabel: string | null;
  /** Sequential id of the linked device, or null/absent when the vehicle has none. */
  deviceId?: string | null;
}

export interface VehiclesResponse extends BaseResponse {}
