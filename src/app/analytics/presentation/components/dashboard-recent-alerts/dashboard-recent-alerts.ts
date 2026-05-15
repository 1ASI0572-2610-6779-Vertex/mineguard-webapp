import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardRecentAlert } from '../../../domain/model/dashboard-recent-alert.entity';

/**
 * Live alert log table for the control-center dashboard.
 */
@Component({
  selector: 'app-dashboard-recent-alerts',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './dashboard-recent-alerts.html',
  styleUrl: './dashboard-recent-alerts.css',
})
export class DashboardRecentAlerts {
  @Input({ required: true }) recentAlerts: DashboardRecentAlert[] = [];

  /**
   * Maps a severity value coming from the API to its translation key.
   */
  getSeverityKey(severity: string): string {
    const value = severity?.toLowerCase();
    if (value === 'high') return 'dashboard.severity.high';
    if (value === 'medium') return 'dashboard.severity.medium';
    if (value === 'low') return 'dashboard.severity.low';
    return severity;
  }
}
