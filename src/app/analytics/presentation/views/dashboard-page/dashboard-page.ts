import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [
    MatIconModule,
    DashboardStats,
    DashboardTrendComponent,
    DashboardRiskDrivers,
    DashboardRecentAlerts,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private store = inject(AnalyticsStore);
  private iamStore = inject(IamStore);

  readonly displayName = this.iamStore.currentUsername;
  readonly displayRole = this.iamStore.currentRole;

  readonly summary = this.store.dashboardSummary;
  readonly trend = this.store.dashboardTrend;
  readonly riskDrivers          = this.store.riskDrivers;
  readonly performanceMetrics   = this.store.performanceMetrics;
  readonly recentAlerts = this.store.recentAlerts;

  readonly todayLabel = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /** Derived operation status based on criticalAlerts count */
  readonly operationStatus = computed(() => {
    const s = this.summary();
    if (!s) return 'loading';
    if (s.criticalAlerts > 5) return 'critical';
    if (s.criticalAlerts > 0) return 'warning';
    return 'normal';
  });

  readonly operationStatusLabel = computed(() => {
    switch (this.operationStatus()) {
      case 'critical': return 'OPERACIÓN CRÍTICA';
      case 'warning':  return 'ATENCIÓN REQUERIDA';
      case 'normal':   return 'OPERACIÓN NORMAL';
      default:         return 'CARGANDO...';
    }
  });

  readonly operationStatusIcon = computed(() => {
    switch (this.operationStatus()) {
      case 'critical': return 'crisis_alert';
      case 'warning':  return 'warning';
      default:         return 'check_circle';
    }
  });

  onDriverSelected(driverId: number): void {
    this.store.loadPerformanceMetrics(driverId);
  }

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
