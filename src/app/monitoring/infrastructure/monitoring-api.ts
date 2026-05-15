import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { Alert } from '../domain/model/alert.entity';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { CardiacReading } from '../domain/model/cardiac-reading.entity';
import { FleetSummary } from '../domain/model/fleet-summary.entity';
import { LiveMapVehicle } from '../domain/model/live-map-vehicle.entity';
import { AlertsApiEndpoint } from './alerts-api-endpoint';
import { AuditLogApiEndpoint } from './audit-log-api-endpoint';
import { CardiacReadingsApiEndpoint } from './cardiac-readings-api-endpoint';
import { FleetSummaryApiEndpoint } from './fleet-summary-api-endpoint';
import { LiveMapVehiclesApiEndpoint } from './live-map-vehicles-api-endpoint';

/**
 * Infrastructure facade for the monitoring bounded context.
 */
@Injectable({ providedIn: 'root' })
export class MonitoringApi extends BaseApi {
  private readonly auditLogEndpoint: AuditLogApiEndpoint;
  private readonly alertsEndpoint: AlertsApiEndpoint;
  private readonly liveMapVehiclesEndpoint: LiveMapVehiclesApiEndpoint;
  private readonly fleetSummaryEndpoint: FleetSummaryApiEndpoint;
  private readonly cardiacReadingsEndpoint: CardiacReadingsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.auditLogEndpoint = new AuditLogApiEndpoint(http);
    this.alertsEndpoint = new AlertsApiEndpoint(http);
    this.liveMapVehiclesEndpoint = new LiveMapVehiclesApiEndpoint(http);
    this.fleetSummaryEndpoint = new FleetSummaryApiEndpoint(http);
    this.cardiacReadingsEndpoint = new CardiacReadingsApiEndpoint(http);
  }

  getAuditLog(): Observable<AuditLogEntry[]> {
    return this.auditLogEndpoint.getAll();
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertsEndpoint.getAll();
  }

  updateAlert(alert: Alert): Observable<Alert> {
    return this.alertsEndpoint.update(alert, alert.id);
  }

  getLiveMapVehicles(): Observable<LiveMapVehicle[]> {
    return this.liveMapVehiclesEndpoint.getAll();
  }

  getFleetSummary(): Observable<FleetSummary[]> {
    return this.fleetSummaryEndpoint.getAll();
  }

  getCardiacReadings(): Observable<CardiacReading[]> {
    return this.cardiacReadingsEndpoint.getAll();
  }
}
