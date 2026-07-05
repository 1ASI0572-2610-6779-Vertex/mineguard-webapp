import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { DriverResource } from '../../assets/infrastructure/driver-response';
import { DashboardRiskDriver } from '../domain/model/dashboard-risk-driver.entity';
import { DashboardRiskDriversAssembler } from './dashboard-risk-drivers-assembler';
import {
  DashboardRiskDriverResource,
  DashboardRiskDriversResponse,
} from './dashboard-risk-drivers-response';

const driversUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderDriversEndpointPath}`;

/**
 * Dashboard "top risk drivers" widget.
 *
 * @remarks
 * There is no dedicated `/dashboard/risk-drivers` endpoint in the contract — the
 * ranking is derived from the drivers directory via
 * `GET /drivers?sort=-riskScore&limit=N` (ordering never mutates the projection,
 * only its order/size). Each `DriverResource` is mapped onto the existing
 * {@link DashboardRiskDriver} entity the widget renders (the driver's
 * `specialty` stands in for the displayed vehicle type).
 */
export class DashboardRiskDriversApiEndpoint extends BaseApiEndpoint<
  DashboardRiskDriver,
  DashboardRiskDriverResource,
  DashboardRiskDriversResponse,
  DashboardRiskDriversAssembler
> {
  constructor(http: HttpClient) {
    super(http, driversUrl, new DashboardRiskDriversAssembler());
  }

  getTopRisk(limit = 5): Observable<DashboardRiskDriver[]> {
    const params = new HttpParams().set('sort', '-riskScore').set('limit', limit);
    return this.http.get<DriverResource[]>(driversUrl, { params }).pipe(
      map((drivers) => drivers.map((d) => new DashboardRiskDriver({
        id: d.id,
        driverId: d.id,
        driverName: d.fullName,
        vehicleType: d.specialty,
        riskScore: d.riskScore ?? 0,
      }))),
      catchError(this.handleError('Failed to fetch risk drivers')),
    );
  }
}
