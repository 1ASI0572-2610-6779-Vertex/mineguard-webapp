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

  getRecent(limit = 5): Observable<DashboardRecentAlert[]> {
    const params = new HttpParams()
      .set('view', 'operational')
      .set('sort', '-occurredAt')
      .set('limit', limit);
    return this.http.get<AlertResource[]>(alertsUrl, { params }).pipe(
      map((alerts) => alerts.map((a) => new DashboardRecentAlert({
        id: a.id,
        alertCode: a.code,
        severity: a.priority,
        category: a.type,
        driverName: a.driverName,
        vehicleCode: a.vehicleCode,
        vehicleType: a.vehicleClassKey,
        route: '',
        time: a.occurredAt,
        status: a.status,
      }))),
      catchError(this.handleError('Failed to fetch recent alerts')),
    );
  }
}
