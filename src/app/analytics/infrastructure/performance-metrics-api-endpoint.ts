import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  // GET /api/v1/drivers/{driverId}/performance-metrics
  getByDriverId(driverId: number): Observable<PerformanceMetric[]> {
    const url = `${this.endpointUrl}/${driverId}/performance-metrics`;
    return this.http.get<PerformanceMetricResource[]>(url).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch performance metrics for driver ${driverId}`)),
    );
  }
}
