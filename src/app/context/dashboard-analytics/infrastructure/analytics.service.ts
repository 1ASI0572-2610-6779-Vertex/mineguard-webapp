import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';

import {
  PerformanceMetric,
  Report,
  DashboardSummary,
  DashboardTrend,
  DashboardRiskDriver,
  DashboardRecentAlert,
  AnalyticsFatigueBar,
  AnalyticsIncidentDistribution,
  AnalyticsHistoryRow,
  AnalyticsInsight,
} from '../domain/analytics.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private api: ApiService) {}

  getMetrics(): Observable<PerformanceMetric[]> {
    return this.api.getAll<PerformanceMetric>('performanceMetrics');
  }

  getReports(): Observable<Report[]> {
    return this.api.getAll<Report>('reports');
  }

  getDashboardSummary(): Observable<DashboardSummary[]> {
    return this.api.getAll<DashboardSummary>('dashboardSummary');
  }

  getDashboardTrend(): Observable<DashboardTrend[]> {
    return this.api.getAll<DashboardTrend>('dashboardTrend');
  }

  getDashboardRiskDrivers(): Observable<DashboardRiskDriver[]> {
    return this.api.getAll<DashboardRiskDriver>('dashboardRiskDrivers');
  }

  getDashboardRecentAlerts(): Observable<DashboardRecentAlert[]> {
    return this.api.getAll<DashboardRecentAlert>('dashboardRecentAlerts');
  }

  getAnalyticsFatigueBars(): Observable<AnalyticsFatigueBar[]> {
    return this.api.getAll<AnalyticsFatigueBar>('analyticsFatigueBars');
  }

  getAnalyticsIncidentDistribution(): Observable<AnalyticsIncidentDistribution[]> {
    return this.api.getAll<AnalyticsIncidentDistribution>('analyticsIncidentDistribution');
  }

  getAnalyticsHistoryRows(): Observable<AnalyticsHistoryRow[]> {
    return this.api.getAll<AnalyticsHistoryRow>('analyticsHistoryRows');
  }

  getAnalyticsInsights(): Observable<AnalyticsInsight[]> {
    return this.api.getAll<AnalyticsInsight>('analyticsInsights');
  }
}
