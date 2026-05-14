import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { forkJoin, map, shareReplay } from 'rxjs';

import { AnalyticsApiService } from '../../services/analytics-api.service';
import { DashboardTrend } from '../../model/analytics.entity';

import { DashboardStatsComponent } from '../../components/dashboard-stats/dashboard-stats.component';
import { DashboardTrendComponent } from '../../components/dashboard-trend/dashboard-trend.component';
import { DashboardRiskDriversComponent } from '../../components/dashboard-risk-drivers/dashboard-risk-drivers.component';
import { DashboardRecentAlertsComponent } from '../../components/dashboard-recent-alerts/dashboard-recent-alerts.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStatsComponent,
    DashboardTrendComponent,
    DashboardRiskDriversComponent,
    DashboardRecentAlertsComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  private analyticsService = inject(AnalyticsApiService);

  summary$ = forkJoin({
    summary: this.analyticsService.getDashboardSummary(),
    trend: this.analyticsService.getDashboardTrend(),
    riskDrivers: this.analyticsService.getDashboardRiskDrivers(),
    recentAlerts: this.analyticsService.getDashboardRecentAlerts(),
  }).pipe(
    map((data) => {
      const summary = data.summary[0];

      return {
        id: summary.id,
        activeSensors: summary.activeSensors,
        totalSensors: summary.totalSensors,
        criticalAlerts: summary.criticalAlerts,
        fatigueEvents: summary.fatigueEvents,
        activeVehicles: summary.activeVehicles,
        totalDrivers: summary.totalDrivers,
        recentAlerts: data.recentAlerts,
        topRiskDrivers: data.riskDrivers,
        trend: data.trend,
        alertTrendPath: this.buildPath(data.trend, 'alerts'),
        incidentTrendPath: this.buildPath(data.trend, 'incidents'),
      };
    }),
    shareReplay(1),
  );

  buildPath(trend: DashboardTrend[], key: 'alerts' | 'incidents'): string {
    if (!trend.length) {
      return '';
    }

    const maxValue = Math.max(
      ...trend.map((item) => item.alerts),
      ...trend.map((item) => item.incidents),
      1,
    );

    const width = 700;
    const height = 130;
    const topPadding = 10;

    return trend
      .map((item, index) => {
        const x = index * (width / (trend.length - 1));
        const y = height - (item[key] / maxValue) * height + topPadding;

        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }
}
