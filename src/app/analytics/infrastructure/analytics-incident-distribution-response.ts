import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AnalyticsIncidentDistributionResource extends BaseResource {
  id: number;
  label: string;
  count: number;
  percent: number;
  className: string;
}

export interface AnalyticsIncidentDistributionResponse extends BaseResponse {}
