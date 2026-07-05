import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Alert } from '../domain/model/alert.entity';
import { AlertStatus } from '../domain/model/alert-status';
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

  /**
   * Classifies (closes/dismisses) an alert via `PATCH /alerts/{alertId}`.
   *
   * @remarks
   * There is no separate "action" endpoint in the platform contract — the client
   * sends the target `status` (e.g. `resolved` / `false_alarm`) directly as a
   * partial update. A status change is automatically journaled as an audit entry
   * server-side. `resolutionNotes` is sent when the supervisor added any.
   */
  classify(alertId: number, status: AlertStatus, notes: string): Observable<Alert> {
    const body: { status: AlertStatus; resolutionNotes?: string } = { status };
    if (notes) body.resolutionNotes = notes;

    return this.http
      .patch<AlertResource>(`${this.endpointUrl}/${alertId}`, body)
      .pipe(
        map((r) => this.assembler.toEntityFromResource(r)),
        catchError(this.handleError(`Failed to classify alert ${alertId} as "${status}"`)),
      );
  }
}
