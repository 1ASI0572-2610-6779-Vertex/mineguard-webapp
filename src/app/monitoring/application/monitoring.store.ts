import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';

import { Alert } from '../domain/model/alert.entity';
import { normalizeAlertPriority } from '../domain/model/alert-priority';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { CardiacReading } from '../domain/model/cardiac-reading.entity';
import { ClassifyAlertCommand } from '../domain/model/classify-alert.command';
import { FleetSummary } from '../domain/model/fleet-summary.entity';
import { LiveMapVehicle } from '../domain/model/live-map-vehicle.entity';
import { MonitoringApi } from '../infrastructure/monitoring-api';
import { CompanyKpisStore } from '../../shared/application/company-kpis.store';
import { exportFormatExtension, triggerBlobDownload } from '../../shared/infrastructure/file-download';
import { AlertStatus } from '../domain/model/alert-status';
import { AlertType } from '../domain/model/alert-type';

/**
 * Application service for the monitoring bounded context.
 *
 * @remarks
 * Holds the projections surfaced by:
 * - Audit log (admin "Auditoría y Activos")
 * - Operational alerts (supervisor "Gestión de Alertas")
 *
 * All loads run via plain `subscribe()` (no `takeUntilDestroyed`) because the
 * store is a root singleton and the calls happen from component `ngOnInit`.
 */
const LIVE_MAP_POLL_INTERVAL_MS = 4000;

interface DashboardAlertSnapshot {
  id: number;
  alertCode: string;
  severity: string;
  category: string;
  title: string;
  description: string;
  driverName: string;
  vehicleCode: string;
  vehicleType: string;
  time: string;
  status: string;
  resolutionNotes: string;
}

/** See `AlertAssembler` — `proximity` stays its own category, `collision` folds in. */
const DASHBOARD_ALERT_TYPE_ALIASES: Readonly<Record<string, AlertType>> = {
  collision: 'proximity_collision',
};

const DASHBOARD_ALERT_STATUS_ALIASES: Readonly<Record<string, AlertStatus>> = {
  active: 'open',
  false_alarm: 'reviewed',
};

function normalizeDashboardAlertType(raw: string): AlertType {
  const key = (raw ?? '').toLowerCase();
  return DASHBOARD_ALERT_TYPE_ALIASES[key] ?? (key as AlertType);
}

function normalizeDashboardAlertStatus(raw: string): AlertStatus {
  const key = (raw ?? '').toLowerCase();
  return DASHBOARD_ALERT_STATUS_ALIASES[key] ?? (key as AlertStatus);
}

@Injectable({ providedIn: 'root' })
export class MonitoringStore implements OnDestroy {
  private liveMapPollHandle: ReturnType<typeof setInterval> | null = null;
  private readonly kpisStore = inject(CompanyKpisStore);

  private readonly auditLogSignal = signal<AuditLogEntry[]>([]);
  private readonly alertsSignal = signal<Alert[]>([]);
  private readonly liveMapVehiclesSignal = signal<LiveMapVehicle[]>([]);
  private readonly cardiacReadingSignal = signal<CardiacReading | null>(null);
  private readonly errorSignal = signal<string | null>(null);

  readonly auditLog = this.auditLogSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly liveMapVehicles = this.liveMapVehiclesSignal.asReadonly();
  /** Fleet counters, derived from the shared tenant-KPIs cache. */
  readonly fleetSummary = computed(() => {
    const kpis = this.kpisStore.kpis();
    return kpis ? FleetSummary.fromKpis(kpis) : null;
  });
  readonly cardiacReading = this.cardiacReadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * Derived view consumed by the live-map "Resumen de Alertas" sidebar widget:
   * only active alerts with critical priority, projected from the existing
   * alerts signal so a classification fires the recompute.
   */
  readonly criticalActiveAlerts = computed(() =>
    this.alertsSignal().filter(
      (alert) => alert.status === 'open' && alert.priority === 'critical',
    ),
  );

  constructor(private monitoringApi: MonitoringApi) {}

  /**
   * Loads the system audit log on demand.
   */
  loadAuditLog(): void {
    this.errorSignal.set(null);
    this.monitoringApi.getAuditLog().subscribe({
      next: (entries) => this.auditLogSignal.set(entries),
      error: (err) => {
        console.error('Failed to load audit log:', err);
        this.errorSignal.set('Failed to load audit log');
      },
    });
  }

  /**
   * Loads the operational alerts inbox on demand.
   */
  loadAlerts(): void {
    this.errorSignal.set(null);
    this.monitoringApi.getAlerts().subscribe({
      next: (alerts) => this.alertsSignal.set(alerts),
      error: (err) => {
        console.error('Failed to load alerts:', err);
        this.errorSignal.set('Failed to load alerts');
      },
    });
  }

  seedAlertsFromDashboard(alerts: DashboardAlertSnapshot[]): void {
    this.alertsSignal.set(alerts.map((alert) => new Alert({
      id: alert.id,
      code: alert.alertCode,
      type: normalizeDashboardAlertType(alert.category),
      priority: normalizeAlertPriority(alert.severity),
      status: normalizeDashboardAlertStatus(alert.status),
      occurredAt: alert.time,
      title: alert.title,
      description: alert.description,
      vehicleClassKey: alert.vehicleType,
      vehicleCode: alert.vehicleCode,
      driverName: alert.driverName,
      resolutionNotes: alert.resolutionNotes,
    })));
  }

  /**
   * Classifies an alert via PATCH /api/v1/alerts/{alertId} (sending the target
   * status directly) and replaces the entry in the local inbox signal on success.
   */
  classifyAlert(command: ClassifyAlertCommand): void {
    if (!this.alertsSignal().find((a) => a.id === command.alertId)) return;

    this.errorSignal.set(null);
    this.monitoringApi.classifyAlert(command.alertId, command.status, command.notes).subscribe({
      next: (alert) => {
        this.alertsSignal.update((list) =>
          list.map((a) => (a.id === alert.id ? alert : a)),
        );
      },
      error: (err) => {
        console.error('Failed to classify alert:', err);
        this.errorSignal.set('Failed to classify alert');
      },
    });
  }

  /**
   * Exports the audit trail as a binary file (PDF or Excel) via
   * GET /audit-logs?format=... and triggers the browser download.
   */
  exportAuditLog(format: 'pdf' | 'xls'): void {
    this.errorSignal.set(null);
    this.monitoringApi.exportAuditLog(format).subscribe({
      next: (blob) => triggerBlobDownload(blob, `audit-log.${exportFormatExtension(format)}`),
      error: (err) => {
        console.error('Failed to export audit log:', err);
        this.errorSignal.set('Failed to export audit log');
      },
    });
  }

  /**
   * Starts polling GET /liveMapVehicles every 4 s to simulate real-time positions.
   * Safe to call multiple times — clears any existing interval before starting a new one.
   */
  startLiveMapPolling(intervalMs = LIVE_MAP_POLL_INTERVAL_MS): void {
    this.stopLiveMapPolling();
    const fetch = () => {
      this.monitoringApi.getLiveMapVehicles().subscribe({
        next: (vehicles) => this.liveMapVehiclesSignal.set(vehicles),
        error: (err) => console.error('Live-map poll error:', err),
      });
    };
    fetch();
    this.liveMapPollHandle = setInterval(fetch, intervalMs);
  }

  /** Stops the live-map polling interval. */
  stopLiveMapPolling(): void {
    if (this.liveMapPollHandle !== null) {
      clearInterval(this.liveMapPollHandle);
      this.liveMapPollHandle = null;
    }
  }

  ngOnDestroy(): void {
    this.stopLiveMapPolling();
  }

  /** @deprecated Use startLiveMapPolling() to enable real-time updates. */
  loadLiveMapVehicles(): void {
    this.errorSignal.set(null);
    this.monitoringApi.getLiveMapVehicles().subscribe({
      next: (vehicles) => this.liveMapVehiclesSignal.set(vehicles),
      error: (err) => {
        console.error('Failed to load live-map vehicles:', err);
        this.errorSignal.set('Failed to load live-map vehicles');
      },
    });
  }

  /**
   * Loads the fleet summary aggregate on demand.
   */
  loadFleetSummary(): void {
    // Fleet counters come from the shared CompanyKpisStore (one cached KPIs fetch
    // shared with the dashboard and catalog summaries). `fleetSummary` is a
    // computed projection over that cache.
    this.kpisStore.load();
  }

  /**
   * Loads the latest cardiac reading for a specific Driving Session.
   * The endpoint returns a single reading (the session's active driver), or
   * `null` when the session has not reported a beat yet.
   */
  loadCardiacReading(sessionId: number): void {
    this.errorSignal.set(null);
    this.monitoringApi.getCardiacReading(sessionId).subscribe({
      next: (reading) => this.cardiacReadingSignal.set(reading),
      error: (err) => {
        console.error('Failed to load cardiac reading:', err);
        this.errorSignal.set('Failed to load cardiac reading');
      },
    });
  }
}
