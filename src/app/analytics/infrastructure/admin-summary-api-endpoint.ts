import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AdminSummary } from '../domain/model/admin-summary.entity';
import { AdminSummaryAssembler } from './admin-summary-assembler';
import { AdminSummaryResource, AdminSummaryResponse } from './admin-summary-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderPlatformMetricsEndpointPath}`;

/**
 * HTTP endpoint client for the cross-tenant platform summary:
 * `GET /platform/metrics` (ADMIN/GLOBAL_ADMIN).
 *
 * @remarks
 * The only intentionally cross-tenant endpoint of the contract — it is **not**
 * scoped by company. Returns the summary object **directly, not in an array**.
 */
export class AdminSummaryApiEndpoint extends BaseApiEndpoint<
  AdminSummary,
  AdminSummaryResource,
  AdminSummaryResponse,
  AdminSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new AdminSummaryAssembler());
  }

  getPlatformMetrics(): Observable<AdminSummary> {
    return this.http.get<AdminSummaryResource>(endpointUrl).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch platform metrics')),
    );
  }
}
