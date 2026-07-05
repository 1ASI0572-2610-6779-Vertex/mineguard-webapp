import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { IamStore } from '../../iam/application/iam.store';
import { Alert } from '../domain/model/alert.entity';
import { AlertStatus } from '../domain/model/alert-status';
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
  private readonly iamStore = inject(IamStore);

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

  /** GET /audit-logs?format=pdf|xls — download the audit trail as a binary file. */
  exportAuditLog(format: 'pdf' | 'xls'): Observable<Blob> {
    return this.auditLogEndpoint.download(format);
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertsEndpoint.getAll();
  }

  updateAlert(alert: Alert): Observable<Alert> {
    return this.alertsEndpoint.update(alert, alert.id);
  }

  /** PATCH /alerts/{id} — classify (resolve / dismiss) an alert by target status. */
  classifyAlert(alertId: number, status: AlertStatus, notes: string): Observable<Alert> {
    return this.alertsEndpoint.classify(alertId, status, notes);
  }

  getLiveMapVehicles(): Observable<LiveMapVehicle[]> {
    return this.liveMapVehiclesEndpoint.getAll();
  }

  getFleetSummary(): Observable<FleetSummary> {
    const companyId = this.iamStore.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.fleetSummaryEndpoint.getForCompany(companyId);
  }

  /**
   * GET /driving-sessions/{sessionId}/cardiac-readings — latest heart-rate
   * reading for the session's active driver. A session has exactly one active
   * driver, so the resource is a singleton (not an array).
   */
  getCardiacReading(sessionId: number): Observable<CardiacReading> {
    return this.cardiacReadingsEndpoint.getBySessionId(sessionId);
  }
}
