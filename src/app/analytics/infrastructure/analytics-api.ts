import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { IamStore } from '../../iam/application/iam.store';
import { AdminNotice } from '../domain/model/admin-notice.entity';
import { AdminSummary } from '../domain/model/admin-summary.entity';
import { AnalyticsFatigueBar } from '../domain/model/analytics-fatigue-bar.entity';
import { AnalyticsHistoryRow } from '../domain/model/analytics-history-row.entity';
import { AnalyticsIncidentDistribution } from '../domain/model/analytics-incident-distribution.entity';
import { AnalyticsInsight } from '../domain/model/analytics-insight.entity';
import { DashboardRecentAlert } from '../domain/model/dashboard-recent-alert.entity';
import { DashboardRiskDriver } from '../domain/model/dashboard-risk-driver.entity';
import { DashboardTrend } from '../domain/model/dashboard-trend.entity';
import { PerformanceMetric } from '../domain/model/performance-metric.entity';
import { Report } from '../domain/model/report.entity';
import { AdminNoticesApiEndpoint } from './admin-notices-api-endpoint';
import { AdminSummaryApiEndpoint } from './admin-summary-api-endpoint';
import { AnalyticsFatigueBarsApiEndpoint } from './analytics-fatigue-bars-api-endpoint';
import { AnalyticsHistoryRowsApiEndpoint } from './analytics-history-rows-api-endpoint';
import { AnalyticsIncidentDistributionApiEndpoint } from './analytics-incident-distribution-api-endpoint';
import { AnalyticsInsightsApiEndpoint } from './analytics-insights-api-endpoint';
import { DashboardRecentAlertsApiEndpoint } from './dashboard-recent-alerts-api-endpoint';
import { DashboardRiskDriversApiEndpoint } from './dashboard-risk-drivers-api-endpoint';
import { DashboardTrendApiEndpoint } from './dashboard-trend-api-endpoint';
import { PerformanceMetricsApiEndpoint } from './performance-metrics-api-endpoint';
import { ReportsApiEndpoint } from './reports-api-endpoint';

/**
 * Infrastructure facade for the analytics bounded context. Routes calls
 * to the right HTTP endpoint client and surfaces fully-hydrated domain
 * entities to the application layer.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsApi extends BaseApi {
  private readonly iamStore = inject(IamStore);

  private readonly dashboardTrendEndpoint: DashboardTrendApiEndpoint;
  private readonly dashboardRiskDriversEndpoint: DashboardRiskDriversApiEndpoint;
  private readonly dashboardRecentAlertsEndpoint: DashboardRecentAlertsApiEndpoint;
  private readonly performanceMetricsEndpoint: PerformanceMetricsApiEndpoint;
  private readonly reportsEndpoint: ReportsApiEndpoint;
  private readonly analyticsFatigueBarsEndpoint: AnalyticsFatigueBarsApiEndpoint;
  private readonly analyticsIncidentDistributionEndpoint: AnalyticsIncidentDistributionApiEndpoint;
  private readonly analyticsHistoryRowsEndpoint: AnalyticsHistoryRowsApiEndpoint;
  private readonly analyticsInsightsEndpoint: AnalyticsInsightsApiEndpoint;
  private readonly adminSummaryEndpoint: AdminSummaryApiEndpoint;
  private readonly adminNoticesEndpoint: AdminNoticesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.dashboardTrendEndpoint = new DashboardTrendApiEndpoint(http);
    this.dashboardRiskDriversEndpoint = new DashboardRiskDriversApiEndpoint(http);
    this.dashboardRecentAlertsEndpoint = new DashboardRecentAlertsApiEndpoint(http);
    this.performanceMetricsEndpoint = new PerformanceMetricsApiEndpoint(http);
    this.reportsEndpoint = new ReportsApiEndpoint(http);
    this.analyticsFatigueBarsEndpoint = new AnalyticsFatigueBarsApiEndpoint(http);
    this.analyticsIncidentDistributionEndpoint = new AnalyticsIncidentDistributionApiEndpoint(http);
    this.analyticsHistoryRowsEndpoint = new AnalyticsHistoryRowsApiEndpoint(http);
    this.analyticsInsightsEndpoint = new AnalyticsInsightsApiEndpoint(http);
    this.adminSummaryEndpoint = new AdminSummaryApiEndpoint(http);
    this.adminNoticesEndpoint = new AdminNoticesApiEndpoint(http);
  }

  /**
   * Resolves the tenant id from the authenticated session. Every
   * `/companies/{companyId}/...` read is scoped by this value, which the backend
   * cross-checks against the JWT. Returns null when not signed in.
   */
  private currentCompanyId(): number | null {
    return this.iamStore.currentCompanyId();
  }

  getDashboardTrend(): Observable<DashboardTrend[]> {
    const companyId = this.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.dashboardTrendEndpoint.getForCompany(companyId);
  }

  /** Top risk drivers — derived from GET /drivers?sort=-riskScore&limit. */
  getDashboardRiskDrivers(limit = 5): Observable<DashboardRiskDriver[]> {
    return this.dashboardRiskDriversEndpoint.getTopRisk(limit);
  }

  /** Recent alerts — derived from GET /alerts?view=operational&sort=-occurredAt&limit. */
  getDashboardRecentAlerts(limit = 5): Observable<DashboardRecentAlert[]> {
    return this.dashboardRecentAlertsEndpoint.getRecent(limit);
  }

  getPerformanceMetrics(driverId: number): Observable<PerformanceMetric[]> {
    return this.performanceMetricsEndpoint.getByDriverId(driverId);
  }

  getReports(): Observable<Report[]> {
    return this.reportsEndpoint.getAll();
  }

  getAnalyticsFatigueBars(): Observable<AnalyticsFatigueBar[]> {
    const companyId = this.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.analyticsFatigueBarsEndpoint.getForCompany(companyId);
  }

  getAnalyticsIncidentDistribution(): Observable<AnalyticsIncidentDistribution[]> {
    const companyId = this.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.analyticsIncidentDistributionEndpoint.getForCompany(companyId);
  }

  getAnalyticsHistoryRows(page = 0, size = 20): Observable<AnalyticsHistoryRow[]> {
    const companyId = this.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.analyticsHistoryRowsEndpoint.getForCompany(companyId, page, size);
  }

  getAnalyticsInsights(): Observable<AnalyticsInsight[]> {
    const companyId = this.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.analyticsInsightsEndpoint.getForCompany(companyId);
  }

  /** GET /platform/metrics — cross-tenant platform summary (single object). */
  getAdminSummary(): Observable<AdminSummary> {
    return this.adminSummaryEndpoint.getPlatformMetrics();
  }

  getAdminNotices(): Observable<AdminNotice[]> {
    const companyId = this.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.adminNoticesEndpoint.getForCompany(companyId);
  }

  // POST /api/v1/companies/{companyId}/notices/{noticeId}/dispatches
  postNoticeDispatch(noticeId: number): Observable<void> {
    const companyId = this.currentCompanyId();
    if (companyId == null) return throwError(() => new Error('No authenticated company'));
    return this.adminNoticesEndpoint.postDispatch(companyId, noticeId);
  }

  /**
   * GET /drivers/{driverId}/reports/{reportId}?format=pdf|xls — download a
   * report as a binary file.
   */
  downloadReport(driverId: number, reportId: number, format: 'pdf' | 'xls'): Observable<Blob> {
    return this.reportsEndpoint.download(driverId, reportId, format);
  }
}
