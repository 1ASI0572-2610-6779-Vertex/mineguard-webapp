import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AnalyticsHistoryRowResource extends BaseResource {
  id: number;
  date: string;
  time: string;
  criticality: string;
  criticalityLabel: string;
  incidentType: string;
  involved: string;
  location: string;
}

export interface AnalyticsHistoryRowsResponse extends BaseResponse {
  analyticsHistoryRows: AnalyticsHistoryRowResource[];
}
