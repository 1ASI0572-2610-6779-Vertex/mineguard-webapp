import { Component, computed, inject } from '@angular/core';

import { IamStore } from '../../../../iam/application/iam.store';
import { AnalyticsStore } from '../../../application/analytics.store';
import { DashboardTrend } from '../../../domain/model/dashboard-trend.entity';
import { DashboardRecentAlerts } from '../../components/dashboard-recent-alerts/dashboard-recent-alerts';
import { DashboardRiskDrivers } from '../../components/dashboard-risk-drivers/dashboard-risk-drivers';
import { DashboardStats } from '../../components/dashboard-stats/dashboard-stats';
import { DashboardTrend as DashboardTrendComponent } from '../../components/dashboard-trend/dashboard-trend';

/**
 * Control-center dashboard view. Reads aggregated analytics state from
 * {@link AnalyticsStore} and renders the four dashboard widgets.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DashboardStats, DashboardTrendComponent, DashboardRiskDrivers, DashboardRecentAlerts],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private store = inject(AnalyticsStore);
  private iamStore = inject(IamStore);

  readonly displayName = this.iamStore.currentUsername;

  readonly summary = this.store.dashboardSummary;
  readonly trend = this.store.dashboardTrend;
  readonly riskDrivers = this.store.riskDrivers;
  readonly recentAlerts = this.store.recentAlerts;

  readonly alertTrendPath = computed(() => this.buildPath(this.trend(), 'alerts'));
  readonly incidentTrendPath = computed(() => this.buildPath(this.trend(), 'incidents'));

  private buildPath(trend: DashboardTrend[], key: 'alerts' | 'incidents'): string {
    if (!trend.length) return '';

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
        const x = index * (width / Math.max(trend.length - 1, 1));
        const y = height - (item[key] / maxValue) * height + topPadding;
        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }
}
