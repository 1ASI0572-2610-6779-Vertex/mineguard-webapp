import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * `ReportResource` as returned by `GET /reports`. Camel-case per the platform
 * contract (`id`, `incidentId`, `alertId`, `userId`, `metricId`, `reportType`,
 * `createdAt`, `description`).
 */
export interface ReportResource extends BaseResource {
  id: number;
  incidentId: number;
  alertId: number;
  userId: number;
  metricId: number;
  reportType: string;
  createdAt: string;
  description: string;
}

export interface ReportsResponse extends BaseResponse {}
