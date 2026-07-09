import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CompanyKpisStore } from '../../shared/application/company-kpis.store';

import { AdminNotice } from '../domain/model/admin-notice.entity';
import { AdminSummary } from '../domain/model/admin-summary.entity';
import { AnalyticsFatigueBar } from '../domain/model/analytics-fatigue-bar.entity';
import { AnalyticsHistoryRow } from '../domain/model/analytics-history-row.entity';
import { AnalyticsIncidentDistribution } from '../domain/model/analytics-incident-distribution.entity';
import { AnalyticsInsight } from '../domain/model/analytics-insight.entity';
import { DashboardRecentAlert } from '../domain/model/dashboard-recent-alert.entity';
import { DashboardRiskDriver } from '../domain/model/dashboard-risk-driver.entity';
import { DashboardSummary } from '../domain/model/dashboard-summary.entity';
import { DashboardTrend } from '../domain/model/dashboard-trend.entity';
import { PerformanceMetric } from '../domain/model/performance-metric.entity';
import { Report } from '../domain/model/report.entity';
import { AnalyticsApi } from '../infrastructure/analytics-api';
import { exportFormatExtension, triggerBlobDownload } from '../../shared/infrastructure/file-download';

/** Statuses that mean an alert is no longer demanding attention. */
const CLOSED_ALERT_STATUSES: readonly string[] = ['resolved', 'false_alarm'];

/**
 * Buckets the operational alert feed into an hourly series.
 *
 * @remarks
 * Stands in for `GET /companies/{id}/metrics/alerts-trend`, which projects over
 * `Incident` records the telemetry pipeline never materializes and therefore
 * returns an empty series. The alerts themselves carry `occurredAt`, so the same
 * curve is recoverable client-side from data the dashboard already fetches.
 * `incidents` stays 0 — there is no Incident data to plot, and fabricating a
 * second series would misrepresent it.
 */
function hourlyAlertTrend(alerts: DashboardRecentAlert[]): DashboardTrend[] {
  if (!alerts.length) return [];

  const countsByHour = new Map<number, number>();
  for (const alert of alerts) {
    const occurredAt = new Date(alert.time);
    if (isNaN(occurredAt.getTime())) continue;
    const hour = occurredAt.getHours();
    countsByHour.set(hour, (countsByHour.get(hour) ?? 0) + 1);
  }
  if (!countsByHour.size) return [];

  const hours = [...countsByHour.keys()];
  const first = Math.min(...hours);
  const last = Math.max(...hours);

  // Emit every hour in range, including the quiet ones, so the x-axis spacing
  // stays proportional to elapsed time instead of collapsing gaps.
  const series: DashboardTrend[] = [];
  for (let hour = first; hour <= last; hour++) {
    series.push(
      new DashboardTrend({
        id: hour,
        hour: `${String(hour).padStart(2, '0')}:00`,
        alerts: countsByHour.get(hour) ?? 0,
        incidents: 0,
      }),
    );
  }
  return series;
}

/** Donut palette slots understood by `reports-incident-distribution`. */
const DISTRIBUTION_CLASSES = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

/**
 * Groups the operational alert feed by alert type into donut slices.
 *
 * @remarks
 * Stands in for `GET /companies/{id}/metrics/incidents`, which projects over
 * `Incident` records the telemetry pipeline never materializes and therefore
 * returns an empty array — same gap `hourlyAlertTrend` covers for the trend
 * chart. Slices are ranked by count so the palette assigns the hottest colour
 * to the most frequent type.
 */
function incidentDistributionFromAlerts(
  alerts: DashboardRecentAlert[],
): AnalyticsIncidentDistribution[] {
  if (!alerts.length) return [];

  const byCategory = new Map<string, { count: number; label: string }>();
  for (const alert of alerts) {
    const bucket = byCategory.get(alert.category);
    if (bucket) bucket.count++;
    else byCategory.set(alert.category, { count: 1, label: alert.title || alert.category });
  }

  const ranked = [...byCategory.entries()].sort((a, b) => b[1].count - a[1].count);
  return ranked.map(([, { count, label }], index) => new AnalyticsIncidentDistribution({
    id: index + 1,
    label,
    count,
    percent: Math.round((count / alerts.length) * 100),
    className: DISTRIBUTION_CLASSES[index % DISTRIBUTION_CLASSES.length],
  }));
}

/** Table criticality buckets, keyed off the alert priority. */
const CRITICALITY_BY_PRIORITY: Record<string, { key: string; label: string }> = {
  critical: { key: 'high', label: 'Crítico' },
  high: { key: 'high', label: 'Crítico' },
  medium: { key: 'medium', label: 'Medio' },
  low: { key: 'low', label: 'Bajo' },
};

/**
 * Projects the operational alert feed onto the history table's rows.
 *
 * @remarks
 * Stands in for `GET /companies/{id}/history`, which pages over `Incident`
 * records that are never written. Alerts carry no operational zone, so
 * `location` renders a dash rather than inventing one, and no report exists to
 * download (`driverId`/`reportId` stay null, which disables the export button).
 */
function historyRowsFromAlerts(alerts: DashboardRecentAlert[]): AnalyticsHistoryRow[] {
  const rows: AnalyticsHistoryRow[] = [];
  for (const alert of alerts) {
    const occurredAt = new Date(alert.time);
    if (isNaN(occurredAt.getTime())) continue;

    const criticality = CRITICALITY_BY_PRIORITY[alert.severity] ?? { key: 'low', label: 'Bajo' };
    const involved = [alert.driverName, alert.vehicleCode].filter(Boolean).join(' · ');

    rows.push(
      new AnalyticsHistoryRow({
        id: alert.id,
        date: occurredAt.toLocaleDateString(),
        time: occurredAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        criticality: criticality.key,
        criticalityLabel: criticality.label,
        incidentType: alert.title || alert.category,
        involved: involved || '—',
        location: '—',
      }),
    );
  }
  return rows;
}

/**
 * Application service (store) for the analytics bounded context.
 *
 * Loads dashboard and analytics aggregates from the infrastructure layer
 * and exposes them as Angular signals for reactive consumption from views.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsStore {
  private readonly kpisStore = inject(CompanyKpisStore);

  private readonly dashboardTrendSignal = signal<DashboardTrend[]>([]);
  private readonly riskDriversSignal = signal<DashboardRiskDriver[]>([]);
  private readonly operationalAlertsSignal = signal<DashboardRecentAlert[]>([]);
  private readonly performanceMetricsSignal = signal<PerformanceMetric[]>([]);
  private readonly reportsSignal = signal<Report[]>([]);
  private readonly fatigueBarsSignal = signal<AnalyticsFatigueBar[]>([]);
  private readonly incidentDistributionSignal = signal<AnalyticsIncidentDistribution[]>([]);
  private readonly historyRowsSignal = signal<AnalyticsHistoryRow[]>([]);
  private readonly insightsSignal = signal<AnalyticsInsight[]>([]);
  private readonly adminSummarySignal = signal<AdminSummary | null>(null);
  private readonly adminNoticesSignal = signal<AdminNotice[]>([]);

  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Critical alerts still awaiting attention, counted from the operational feed.
   *
   * @remarks
   * `GET /companies/{id}/kpis` reports `criticalAlerts: 0` even while `/alerts`
   * returns critical, unresolved entries — the two endpoints disagree. The feed
   * is the source the "Live Alert Log" already renders, so it wins here.
   */
  readonly criticalAlertsCount = computed(
    () =>
      this.operationalAlertsSignal().filter(
        (alert) => alert.severity === 'critical' && !CLOSED_ALERT_STATUSES.includes(alert.status),
      ).length,
  );

  /** Dashboard KPI snapshot, derived from the shared tenant-KPIs cache. */
  readonly dashboardSummary = computed(() => {
    const kpis = this.kpisStore.kpis();
    if (!kpis) return null;
    const summary = DashboardSummary.fromKpis(kpis);
    summary.criticalAlerts = this.criticalAlertsCount();
    return summary;
  });

  /** Backend hourly series when populated, else one derived from the alert feed. */
  readonly dashboardTrend = computed(() => {
    const fromBackend = this.dashboardTrendSignal();
    return fromBackend.length ? fromBackend : hourlyAlertTrend(this.operationalAlertsSignal());
  });

  /** True while the trend chart is plotting real `Incident` data from the backend. */
  readonly hasIncidentSeries = computed(() => this.dashboardTrendSignal().length > 0);

  readonly riskDrivers = this.riskDriversSignal.asReadonly();

  /** Newest five entries of the operational feed, for the "Live Alert Log" table. */
  readonly recentAlerts = computed(() => this.operationalAlertsSignal().slice(0, 5));
  readonly performanceMetrics = this.performanceMetricsSignal.asReadonly();
  readonly reports = this.reportsSignal.asReadonly();
  readonly fatigueBars = this.fatigueBarsSignal.asReadonly();

  /** Backend breakdown when populated, else one grouped from the alert feed. */
  readonly incidentDistribution = computed(() => {
    const fromBackend = this.incidentDistributionSignal();
    return fromBackend.length
      ? fromBackend
      : incidentDistributionFromAlerts(this.operationalAlertsSignal());
  });

  /** Backend history page when populated, else the alert feed projected as rows. */
  readonly historyRows = computed(() => {
    const fromBackend = this.historyRowsSignal();
    return fromBackend.length ? fromBackend : historyRowsFromAlerts(this.operationalAlertsSignal());
  });
  readonly insights = this.insightsSignal.asReadonly();
  readonly adminSummary = this.adminSummarySignal.asReadonly();
  readonly adminNotices = this.adminNoticesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly alertsCount = computed(() => this.operationalAlertsSignal().length);
  readonly riskDriversCount = computed(() => this.riskDriversSignal().length);

  constructor(private analyticsApi: AnalyticsApi) {
    this.loadDashboardSummary();
    this.loadDashboardTrend();
    this.loadRiskDrivers();
    this.loadRecentAlerts();
  }

  loadDashboardSummary(): void {
    // KPIs are served by the shared CompanyKpisStore (fetched once, cached, and
    // reused by the catalog and fleet summaries). `dashboardSummary` is a
    // computed projection over that cache.
    this.kpisStore.load();
  }

  loadDashboardTrend(): void {
    this.analyticsApi
      .getDashboardTrend()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (trend) => this.dashboardTrendSignal.set(trend),
        error: (err) => this.handleFailure(err, 'Failed to load dashboard trend'),
      });
  }

  loadRiskDrivers(): void {
    this.analyticsApi
      .getDashboardRiskDrivers()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (drivers) => {
          this.riskDriversSignal.set(drivers);
          this.recalculateRiskScores();
        },
        error: (err) => this.handleFailure(err, 'Failed to load risk drivers'),
      });
  }

  /**
   * Loads the whole operational alert feed. The table shows only the newest
   * five, but the critical-alert counter and the hourly trend aggregate over all
   * of them.
   */
  loadRecentAlerts(): void {
    this.analyticsApi
      .getOperationalAlerts()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (alerts) => {
          this.operationalAlertsSignal.set(alerts);
          this.recalculateRiskScores();
        },
        error: (err) => this.handleFailure(err, 'Failed to load recent alerts'),
      });
  }

  loadPerformanceMetrics(driverId: number): void {
    this.analyticsApi.getPerformanceMetrics(driverId).subscribe({
      next: (metrics) => this.performanceMetricsSignal.set(metrics),
      error: (err) => this.handleFailure(err, 'Failed to load performance metrics'),
    });
  }

  loadReports(): void {
    this.analyticsApi.getReports().subscribe({
      next: (reports) => this.reportsSignal.set(reports),
      error: (err) => this.handleFailure(err, 'Failed to load reports'),
    });
  }

  loadFatigueBars(): void {
    this.analyticsApi.getAnalyticsFatigueBars().subscribe({
      next: (bars) => this.fatigueBarsSignal.set(bars),
      error: (err) => this.handleFailure(err, 'Failed to load fatigue bars'),
    });
  }

  loadIncidentDistribution(): void {
    this.analyticsApi.getAnalyticsIncidentDistribution().subscribe({
      next: (distribution) => this.incidentDistributionSignal.set(distribution),
      error: (err) => this.handleFailure(err, 'Failed to load incident distribution'),
    });
  }

  loadHistoryRows(): void {
    this.analyticsApi.getAnalyticsHistoryRows().subscribe({
      next: (rows) => this.historyRowsSignal.set(rows),
      error: (err) => this.handleFailure(err, 'Failed to load history rows'),
    });
  }

  loadInsights(): void {
    this.analyticsApi.getAnalyticsInsights().subscribe({
      next: (insights) => this.insightsSignal.set(insights),
      error: (err) => this.handleFailure(err, 'Failed to load insights'),
    });
  }

  loadAdminSummary(): void {
    this.loadingSignal.set(true);
    this.analyticsApi.getAdminSummary().subscribe({
      next: (summary) => {
        this.adminSummarySignal.set(summary);
        this.loadingSignal.set(false);
      },
      error: (err) => this.handleFailure(err, 'Failed to load admin summary'),
    });
  }

  loadAdminNotices(): void {
    this.analyticsApi.getAdminNotices().subscribe({
      next: (notices) => this.adminNoticesSignal.set(notices),
      error: (err) => this.handleFailure(err, 'Failed to load admin notices'),
    });
  }

  // POST /api/v1/companies/{companyId}/notices/{noticeId}/dispatches
  dispatchNotice(noticeId: number): void {
    this.analyticsApi.postNoticeDispatch(noticeId).subscribe({
      error: (err) => this.handleFailure(err, `Failed to dispatch notice ${noticeId}`),
    });
  }

  /**
   * Downloads GET /drivers/{driverId}/reports/{reportId}?format=pdf|xls and
   * triggers a browser file-save dialog.
   *
   * @remarks
   * The per-driver ownership chain (Report → Alert → DrivingSession → Driver) is
   * enforced server-side, so both `driverId` and `reportId` are required.
   */
  downloadReport(driverId: number, reportId: number, format: 'pdf' | 'xls' = 'pdf'): void {
    this.analyticsApi.downloadReport(driverId, reportId, format).subscribe({
      next: (blob) =>
        triggerBlobDownload(blob, `mineguard-report-${reportId}.${exportFormatExtension(format)}`),
      error: (err) => this.handleFailure(err, `Failed to download report ${reportId}`),
    });
  }

  private handleFailure(error: unknown, fallback: string): void {
    this.loadingSignal.set(false);
    if (error instanceof Error) {
      this.errorSignal.set(
        error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message,
      );
    } else {
      this.errorSignal.set(fallback);
    }
  }

  private recalculateRiskScores(): void {
    const alerts = this.operationalAlertsSignal();

    const updatedDrivers = this.riskDriversSignal().map((driver) => {
      let score = 0;

      alerts
        .filter((alert) => alert.driverName === driver.driverName)
        .forEach((alert) => {
          switch (alert.severity.toLowerCase()) {
            case 'critical':
              score += 20;
              break;

            case 'high':
              score += 15;
              break;

            case 'warning':
              score += 10;
              break;

            case 'medium':
              score += 5;
              break;

            case 'low':
              score += 2;
              break;
          }
        });

      driver.riskScore = score;

      return driver;
    });

    updatedDrivers.sort((a, b) => b.riskScore - a.riskScore);

    this.riskDriversSignal.set(updatedDrivers);
  }
}
