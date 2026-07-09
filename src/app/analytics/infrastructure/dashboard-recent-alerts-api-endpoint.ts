import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AlertResource } from '../../monitoring/infrastructure/alert-response';
import { DashboardRecentAlert } from '../domain/model/dashboard-recent-alert.entity';
import { DashboardRecentAlertsAssembler } from './dashboard-recent-alerts-assembler';
import {
  DashboardRecentAlertResource,
  DashboardRecentAlertsResponse,
} from './dashboard-recent-alerts-response';

const alertsUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderOperationalAlertsEndpointPath}`;

/**
 * Dashboard "recent alerts" table.
 *
 * @remarks
 * There is no dedicated `/dashboard/recent-alerts` endpoint in the contract —
 * the feed is the operational alerts list, most-recent first:
 * `GET /alerts?view=operational&sort=-occurredAt&limit=N`. Each full
 * `AlertResource` is mapped onto the existing {@link DashboardRecentAlert}
 * entity the widget renders (`vehicleClassKey` → displayed vehicle type;
 * `route` is not part of the alert contract, so it renders empty).
 */
export class DashboardRecentAlertsApiEndpoint extends BaseApiEndpoint<
  DashboardRecentAlert,
  DashboardRecentAlertResource,
  DashboardRecentAlertsResponse,
  DashboardRecentAlertsAssembler
> {
  constructor(http: HttpClient) {
    super(http, alertsUrl, new DashboardRecentAlertsAssembler());
  }

  /**
   * Full operational alert feed, most-recent first.
   *
   * @remarks
   * Unlike {@link getRecent} this omits `limit`: the dashboard derives the
   * critical-alert count and the hourly trend from the whole feed, so capping it
   * at five would silently truncate both aggregates.
   */
  getOperational(): Observable<DashboardRecentAlert[]> {
    return this.fetch(new HttpParams().set('view', 'operational').set('sort', '-occurredAt'));
  }

  getRecent(limit = 5): Observable<DashboardRecentAlert[]> {
    return this.fetch(
      new HttpParams().set('view', 'operational').set('sort', '-occurredAt').set('limit', limit),
    );
  }

  private fetch(params: HttpParams): Observable<DashboardRecentAlert[]> {
    return this.http.get<AlertResource[]>(alertsUrl, { params }).pipe(
      map((alerts) => alerts.map((a) => new DashboardRecentAlert({
        id: a.id,
        alertCode: a.code,
        severity: a.priority,
        category: a.type,
        title: a.title ?? '',
        description: a.description ?? '',
        // Null whenever the alert was raised without an active driving session.
        driverName: a.driverName ?? '',
        vehicleCode: a.vehicleCode ?? '',
        vehicleType: a.vehicleClassKey ?? '',
        route: '',
        time: a.occurredAt,
        status: a.status,
        resolutionNotes: a.resolutionNotes ?? '',
      }))),
      catchError(this.handleError('Failed to fetch recent alerts')),
    );
  }
}
