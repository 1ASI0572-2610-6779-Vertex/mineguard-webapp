import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  AnalyticsFatigueBar,
  AnalyticsHistoryRow,
  AnalyticsIncidentDistribution,
  AnalyticsInsight,
  DashboardRecentAlert,
  DashboardRiskDriver,
  DashboardSummary,
  DashboardTrend,
  PerformanceMetric,
  Report,
} from '../model/analytics.entity';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsApiService {
  private baseUrl = environment.serverBasePath;

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<PerformanceMetric[]> {
    return this.http.get<PerformanceMetric[]>(`${this.baseUrl}/performanceMetrics`);
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reports`);
  }

  getDashboardSummary(): Observable<DashboardSummary[]> {
    return this.http.get<DashboardSummary[]>(`${this.baseUrl}/dashboardSummary`);
  }

  getDashboardTrend(): Observable<DashboardTrend[]> {
    return this.http.get<DashboardTrend[]>(`${this.baseUrl}/dashboardTrend`);
  }

  getDashboardRiskDrivers(): Observable<DashboardRiskDriver[]> {
    return this.http.get<DashboardRiskDriver[]>(`${this.baseUrl}/dashboardRiskDrivers`);
  }

  getDashboardRecentAlerts(): Observable<DashboardRecentAlert[]> {
    return this.http.get<DashboardRecentAlert[]>(`${this.baseUrl}/dashboardRecentAlerts`);
  }

  getAnalyticsFatigueBars(): Observable<AnalyticsFatigueBar[]> {
    return this.http.get<AnalyticsFatigueBar[]>(`${this.baseUrl}/analyticsFatigueBars`);
  }

  getAnalyticsIncidentDistribution(): Observable<AnalyticsIncidentDistribution[]> {
    return this.http.get<AnalyticsIncidentDistribution[]>(
      `${this.baseUrl}/analyticsIncidentDistribution`,
    );
  }

  getAnalyticsHistoryRows(): Observable<AnalyticsHistoryRow[]> {
    return this.http.get<AnalyticsHistoryRow[]>(`${this.baseUrl}/analyticsHistoryRows`);
  }

  getAnalyticsInsights(): Observable<AnalyticsInsight[]> {
    return this.http.get<AnalyticsInsight[]>(`${this.baseUrl}/analyticsInsights`);
  }
}
