import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';

import { Alert } from '../domain/model/alert.entity';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { CardiacReading } from '../domain/model/cardiac-reading.entity';
import { ClassifyAlertCommand } from '../domain/model/classify-alert.command';
import { FleetSummary } from '../domain/model/fleet-summary.entity';
import { LiveMapVehicle } from '../domain/model/live-map-vehicle.entity';
import { MonitoringApi } from '../infrastructure/monitoring-api';
import { RouteRepository } from '../../service/domain/route.repository';
import { RouteOverlay } from '../presentation/components/live-map/live-map';
import { Route } from '../../service/domain/model/route.entity';

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

@Injectable({ providedIn: 'root' })
export class MonitoringStore implements OnDestroy {
  private liveMapPollHandle: ReturnType<typeof setInterval> | null = null;
  private routeRepo = inject(RouteRepository);

  private readonly auditLogSignal = signal<AuditLogEntry[]>([]);
  private readonly alertsSignal = signal<Alert[]>([]);
  private readonly liveMapVehiclesSignal = signal<LiveMapVehicle[]>([]);
  private readonly fleetSummarySignal = signal<FleetSummary | null>(null);
  private readonly cardiacReadingsSignal = signal<CardiacReading[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly routesSignal = signal<Route[]>([]);

  readonly auditLog = this.auditLogSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly liveMapVehicles = this.liveMapVehiclesSignal.asReadonly();
  readonly fleetSummary = this.fleetSummarySignal.asReadonly();
  readonly cardiacReadings = this.cardiacReadingsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /**
   * Derived view consumed by the live-map "Resumen de Alertas" sidebar widget:
   * only active alerts with critical priority, projected from the existing
   * alerts signal so a classification fires the recompute.
   */
  readonly criticalActiveAlerts = computed(() =>
    this.alertsSignal().filter(
      (alert) => alert.status === 'active' && alert.priority === 'critical',
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

  readonly routeOverlays = computed<RouteOverlay[]>(() =>
    this.routesSignal().map(route => ({
      id: route.id,
      name: route.name,
      status: route.status,   // 'active' | 'planned' — ya viene del dominio
      coords: route.waypoints
        .sort((a, b) => a.order - b.order)
        .map(wp => [wp.latitude, wp.longitude] as [number, number]),
    }))
  );

  async loadRoutes(): Promise<void> {
    const routes = await this.routeRepo.getAll();
    this.routesSignal.set(routes);
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

  /**
   * Classifies an alert as resolved or false-alarm, persists the new status
   * + resolution notes via the API, and replaces the entry in the local
   * inbox signal on success.
   */
  classifyAlert(command: ClassifyAlertCommand): void {
    const current = this.alertsSignal().find((a) => a.id === command.alertId);
    if (!current) return;

    const updated = new Alert({
      id: current.id,
      code: current.code,
      type: current.type,
      priority: current.priority,
      status: command.status,
      occurredAt: current.occurredAt,
      title: current.title,
      description: current.description,
      vehicleClassKey: current.vehicleClassKey,
      vehicleCode: current.vehicleCode,
      driverName: current.driverName,
      resolutionNotes: command.notes,
    });

    this.errorSignal.set(null);
    this.monitoringApi.updateAlert(updated).subscribe({
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
    this.errorSignal.set(null);
    this.monitoringApi.getFleetSummary().subscribe({
      next: (summaries) => this.fleetSummarySignal.set(summaries[0] ?? null),
      error: (err) => {
        console.error('Failed to load fleet summary:', err);
        this.errorSignal.set('Failed to load fleet summary');
      },
    });
  }

  /**
   * Loads the cardiac monitor readings on demand.
   */
  loadCardiacReadings(): void {
    this.errorSignal.set(null);
    this.monitoringApi.getCardiacReadings().subscribe({
      next: (readings) => this.cardiacReadingsSignal.set(readings),
      error: (err) => {
        console.error('Failed to load cardiac readings:', err);
        this.errorSignal.set('Failed to load cardiac readings');
      },
    });
  }
}
