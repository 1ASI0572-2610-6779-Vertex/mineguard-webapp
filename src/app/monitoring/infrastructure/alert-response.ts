import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { AlertPriority } from '../domain/model/alert-priority';

export interface AlertResource extends BaseResource {
  id: number;
  code: string;
  /** Raw backend discriminator — narrowed to `AlertType` by the assembler. */
  type: string;
  priority: AlertPriority;
  /** Raw backend status (`active`, …) — narrowed to `AlertStatus` by the assembler. */
  status: string;
  occurredAt: string;
  title: string;
  description: string;
  /** Null on telemetry alerts raised without an active driving session. */
  vehicleClassKey: string | null;
  vehicleCode: string | null;
  driverName: string | null;
  resolutionNotes: string | null;
}

export interface AlertsResponse extends BaseResponse {}
