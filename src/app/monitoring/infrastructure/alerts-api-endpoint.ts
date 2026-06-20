import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Alert } from '../domain/model/alert.entity';
import { AlertAssembler } from './alert-assembler';
import { AlertResource, AlertsResponse } from './alert-response';

/**
 * HTTP endpoint client for operational alerts.
 */
export class AlertsApiEndpoint extends BaseApiEndpoint<
  Alert,
  AlertResource,
  AlertsResponse,
  AlertAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderOperationalAlertsEndpointPath}`,
      new AlertAssembler(),
    );
  }

  override getAll(): Observable<Alert[]> {
    const params = new HttpParams().set('view', 'operational');
    return this.http.get<AlertResource[]>(this.endpointUrl, { params }).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch operational alerts')),
    );
  }

  postAction(alertId: number, action: 'markReviewed' | 'escalate' | 'resolve'): Observable<Alert> {
    return this.http
      .post<AlertResource>(`${this.endpointUrl}/${alertId}/actions`, { action })
      .pipe(
        map((r) => this.assembler.toEntityFromResource(r)),
        catchError(this.handleError(`Failed to post action "${action}" for alert ${alertId}`)),
      );
  }
}
