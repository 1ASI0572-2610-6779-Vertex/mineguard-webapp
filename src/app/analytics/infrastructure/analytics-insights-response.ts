import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AnalyticsInsightResource extends BaseResource {
  id: number;
  title: string;
  description: string;
  className: string;
}

export interface AnalyticsInsightsResponse extends BaseResponse {
  analyticsInsights: AnalyticsInsightResource[];
}
