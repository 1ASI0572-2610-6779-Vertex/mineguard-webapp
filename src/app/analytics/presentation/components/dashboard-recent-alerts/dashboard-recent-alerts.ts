import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardRecentAlert } from '../../../domain/model/dashboard-recent-alert.entity';

@Component({
  selector: 'app-dashboard-recent-alerts',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-recent-alerts.html',
  styleUrl: './dashboard-recent-alerts.css',
})
export class DashboardRecentAlerts {
  @Input({ required: true }) recentAlerts: DashboardRecentAlert[] = [];

  getSeverityKey(severity: string): string {
    const value = severity?.toLowerCase();
    if (value === 'high') return 'dashboard.severity.high';
    if (value === 'medium') return 'dashboard.severity.medium';
    if (value === 'low') return 'dashboard.severity.low';
    return severity;
  }
}
