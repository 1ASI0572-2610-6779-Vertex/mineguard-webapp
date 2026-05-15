import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
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
import { AnalyticsFatigueBarsApiEndpoint } from './analytics-fatigue-bars-api-endpoint';
import { AnalyticsHistoryRowsApiEndpoint } from './analytics-history-rows-api-endpoint';
import { AnalyticsIncidentDistributionApiEndpoint } from './analytics-incident-distribution-api-endpoint';
import { AnalyticsInsightsApiEndpoint } from './analytics-insights-api-endpoint';
import { DashboardRecentAlertsApiEndpoint } from './dashboard-recent-alerts-api-endpoint';
import { DashboardRiskDriversApiEndpoint } from './dashboard-risk-drivers-api-endpoint';
import { DashboardSummaryApiEndpoint } from './dashboard-summary-api-endpoint';
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
  private readonly dashboardSummaryEndpoint: DashboardSummaryApiEndpoint;
  private readonly dashboardTrendEndpoint: DashboardTrendApiEndpoint;
  private readonly dashboardRiskDriversEndpoint: DashboardRiskDriversApiEndpoint;
  private readonly dashboardRecentAlertsEndpoint: DashboardRecentAlertsApiEndpoint;
  private readonly performanceMetricsEndpoint: PerformanceMetricsApiEndpoint;
  private readonly reportsEndpoint: ReportsApiEndpoint;
  private readonly analyticsFatigueBarsEndpoint: AnalyticsFatigueBarsApiEndpoint;
  private readonly analyticsIncidentDistributionEndpoint: AnalyticsIncidentDistributionApiEndpoint;
  private readonly analyticsHistoryRowsEndpoint: AnalyticsHistoryRowsApiEndpoint;
  private readonly analyticsInsightsEndpoint: AnalyticsInsightsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.dashboardSummaryEndpoint = new DashboardSummaryApiEndpoint(http);
    this.dashboardTrendEndpoint = new DashboardTrendApiEndpoint(http);
    this.dashboardRiskDriversEndpoint = new DashboardRiskDriversApiEndpoint(http);
    this.dashboardRecentAlertsEndpoint = new DashboardRecentAlertsApiEndpoint(http);
    this.performanceMetricsEndpoint = new PerformanceMetricsApiEndpoint(http);
    this.reportsEndpoint = new ReportsApiEndpoint(http);
    this.analyticsFatigueBarsEndpoint = new AnalyticsFatigueBarsApiEndpoint(http);
    this.analyticsIncidentDistributionEndpoint = new AnalyticsIncidentDistributionApiEndpoint(http);
    this.analyticsHistoryRowsEndpoint = new AnalyticsHistoryRowsApiEndpoint(http);
    this.analyticsInsightsEndpoint = new AnalyticsInsightsApiEndpoint(http);
  }

  getDashboardSummary(): Observable<DashboardSummary[]> {
    return this.dashboardSummaryEndpoint.getAll();
  }

  getDashboardTrend(): Observable<DashboardTrend[]> {
    return this.dashboardTrendEndpoint.getAll();
  }

  getDashboardRiskDrivers(): Observable<DashboardRiskDriver[]> {
    return this.dashboardRiskDriversEndpoint.getAll();
  }

  getDashboardRecentAlerts(): Observable<DashboardRecentAlert[]> {
    return this.dashboardRecentAlertsEndpoint.getAll();
  }

  getPerformanceMetrics(): Observable<PerformanceMetric[]> {
    return this.performanceMetricsEndpoint.getAll();
  }

  getReports(): Observable<Report[]> {
    return this.reportsEndpoint.getAll();
  }

  getAnalyticsFatigueBars(): Observable<AnalyticsFatigueBar[]> {
    return this.analyticsFatigueBarsEndpoint.getAll();
  }

  getAnalyticsIncidentDistribution(): Observable<AnalyticsIncidentDistribution[]> {
    return this.analyticsIncidentDistributionEndpoint.getAll();
  }

  getAnalyticsHistoryRows(): Observable<AnalyticsHistoryRow[]> {
    return this.analyticsHistoryRowsEndpoint.getAll();
  }

  getAnalyticsInsights(): Observable<AnalyticsInsight[]> {
    return this.analyticsInsightsEndpoint.getAll();
  }
}
