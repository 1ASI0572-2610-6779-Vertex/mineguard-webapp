import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { DriverShiftStatus } from '../domain/model/driver-shift-status';

export interface DriverResource extends BaseResource {
  id: number;
  fullName: string;
  operatorId: string;
  license: string;
  specialty: string;
  shiftStatus: DriverShiftStatus;
  lastAccess: string;
}

export interface DriversResponse extends BaseResponse {
  drivers: DriverResource[];
}
