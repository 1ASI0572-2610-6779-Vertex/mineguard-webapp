import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { CardiacStatus } from '../domain/model/cardiac-status';

export interface CardiacReadingResource extends BaseResource {
  id: number;
  driverName: string;
  vehicleCode: string;
  heartRate: number;
  status: CardiacStatus;
}

export interface CardiacReadingsResponse extends BaseResponse {}
