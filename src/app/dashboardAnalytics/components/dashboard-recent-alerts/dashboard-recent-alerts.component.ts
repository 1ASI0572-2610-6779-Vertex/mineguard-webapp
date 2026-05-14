import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardRecentAlert } from '../../model/analytics.entity';

@Component({
  selector: 'app-dashboard-recent-alerts',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-recent-alerts.component.html',
  styleUrl: './dashboard-recent-alerts.component.css',
})
export class DashboardRecentAlertsComponent {
  @Input({ required: true }) recentAlerts: DashboardRecentAlert[] = [];

  getSeverityKey(severity: string): string {
    const value = severity?.toLowerCase();

    if (value === 'high') {
      return 'dashboard.severity.high';
    }

    if (value === 'medium') {
      return 'dashboard.severity.medium';
    }

    if (value === 'low') {
      return 'dashboard.severity.low';
    }

    return severity;
  }
}
