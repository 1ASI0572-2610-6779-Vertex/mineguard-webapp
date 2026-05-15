import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { PerformanceMetric } from '../domain/model/performance-metric.entity';
import { PerformanceMetricAssembler } from './performance-metric-assembler';
import {
  PerformanceMetricResource,
  PerformanceMetricsResponse,
} from './performance-metrics-response';

export class PerformanceMetricsApiEndpoint extends BaseApiEndpoint<
  PerformanceMetric,
  PerformanceMetricResource,
  PerformanceMetricsResponse,
  PerformanceMetricAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderPerformanceMetricsEndpointPath}`,
      new PerformanceMetricAssembler()
    );
  }
}
