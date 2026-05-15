import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AnalyticsInsight } from '../domain/model/analytics-insight.entity';
import { AnalyticsInsightAssembler } from './analytics-insight-assembler';
import {
  AnalyticsInsightResource,
  AnalyticsInsightsResponse,
} from './analytics-insights-response';

export class AnalyticsInsightsApiEndpoint extends BaseApiEndpoint<
  AnalyticsInsight,
  AnalyticsInsightResource,
  AnalyticsInsightsResponse,
  AnalyticsInsightAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderAnalyticsInsightsEndpointPath}`,
      new AnalyticsInsightAssembler()
    );
  }
}
