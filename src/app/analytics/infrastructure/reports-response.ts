import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ReportResource extends BaseResource {
  id: number;
  id_incident: number;
  id_alert: number;
  id_user: number;
  id_metric: number;
  report_type: string;
  created_at: string;
  description: string;
}

export interface ReportsResponse extends BaseResponse {}
