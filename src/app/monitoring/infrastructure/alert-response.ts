import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { AlertPriority } from '../domain/model/alert-priority';
import { AlertStatus } from '../domain/model/alert-status';
import { AlertType } from '../domain/model/alert-type';

export interface AlertResource extends BaseResource {
  id: number;
  code: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  occurredAt: string;
  title: string;
  description: string;
  vehicleClassKey: string;
  vehicleCode: string;
  driverName: string;
  resolutionNotes: string;
}

export interface AlertsResponse extends BaseResponse {
  alerts: AlertResource[];
}
