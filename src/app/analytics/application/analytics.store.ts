import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

/**
 * Application service (store) for the analytics bounded context.
 *
 * Loads dashboard and analytics aggregates from the infrastructure layer
 * and exposes them as Angular signals for reactive consumption from views.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsStore {
  private readonly dashboardSummarySignal = signal<DashboardSummary | null>(null);
  private readonly dashboardTrendSignal = signal<DashboardTrend[]>([]);
  private readonly riskDriversSignal = signal<DashboardRiskDriver[]>([]);
  private readonly recentAlertsSignal = signal<DashboardRecentAlert[]>([]);
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

  readonly dashboardSummary = this.dashboardSummarySignal.asReadonly();
  readonly dashboardTrend = this.dashboardTrendSignal.asReadonly();
  readonly riskDrivers = this.riskDriversSignal.asReadonly();
  readonly recentAlerts = this.recentAlertsSignal.asReadonly();
  readonly performanceMetrics = this.performanceMetricsSignal.asReadonly();
  readonly reports = this.reportsSignal.asReadonly();
  readonly fatigueBars = this.fatigueBarsSignal.asReadonly();
  readonly incidentDistribution = this.incidentDistributionSignal.asReadonly();
  readonly historyRows = this.historyRowsSignal.asReadonly();
  readonly insights = this.insightsSignal.asReadonly();
  readonly adminSummary = this.adminSummarySignal.asReadonly();
  readonly adminNotices = this.adminNoticesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly alertsCount = computed(() => this.recentAlertsSignal().length);
  readonly riskDriversCount = computed(() => this.riskDriversSignal().length);

  constructor(private analyticsApi: AnalyticsApi) {
    this.loadDashboardSummary();
    this.loadDashboardTrend();
    this.loadRiskDrivers();
    this.loadRecentAlerts();
  }

  loadDashboardSummary(): void {
    this.loadingSignal.set(true);
    this.analyticsApi.getDashboardSummary().pipe(takeUntilDestroyed()).subscribe({
      next: (summaries) => {
        this.dashboardSummarySignal.set(summaries[0] ?? null);
        this.loadingSignal.set(false);
      },
      error: (err) => this.handleFailure(err, 'Failed to load dashboard summary'),
    });
  }

  loadDashboardTrend(): void {
    this.analyticsApi.getDashboardTrend().pipe(takeUntilDestroyed()).subscribe({
      next: (trend) => this.dashboardTrendSignal.set(trend),
      error: (err) => this.handleFailure(err, 'Failed to load dashboard trend'),
    });
  }

  loadRiskDrivers(): void {
    this.analyticsApi.getDashboardRiskDrivers().pipe(takeUntilDestroyed()).subscribe({
      next: (drivers) => this.riskDriversSignal.set(drivers),
      error: (err) => this.handleFailure(err, 'Failed to load risk drivers'),
    });
  }

  loadRecentAlerts(): void {
    this.analyticsApi.getDashboardRecentAlerts().pipe(takeUntilDestroyed()).subscribe({
      next: (alerts) => this.recentAlertsSignal.set(alerts),
      error: (err) => this.handleFailure(err, 'Failed to load recent alerts'),
    });
  }

  loadPerformanceMetrics(): void {
    this.analyticsApi.getPerformanceMetrics().subscribe({
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
      next: (summaries) => {
        this.adminSummarySignal.set(summaries[0] ?? null);
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

  /**
   * Downloads GET /reports/{id}/pdf and triggers a browser file-save dialog.
   */
  downloadReportPdf(id: number): void {
    this.analyticsApi.downloadReportPdf(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `mineguard-report-${id}.pdf`;
        anchor.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => this.handleFailure(err, `Failed to download report ${id}`),
    });
  }

  private handleFailure(error: unknown, fallback: string): void {
    this.loadingSignal.set(false);
    if (error instanceof Error) {
      this.errorSignal.set(error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message);
    } else {
      this.errorSignal.set(fallback);
    }
  }
}
