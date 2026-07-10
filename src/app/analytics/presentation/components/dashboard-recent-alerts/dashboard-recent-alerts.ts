import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import {
  AlertPriority,
  alertPriorityIcon,
  normalizeAlertPriority,
} from '../../../../monitoring/domain/model/alert-priority';
import { DashboardRecentAlert } from '../../../domain/model/dashboard-recent-alert.entity';
import { AlertDetailDialog } from '../alert-detail-dialog/alert-detail-dialog';

/**
 * Live alert log table for the control-center dashboard.
 * Clicking "Atender" on an active alert opens AlertDetailDialog.
 */
@Component({
  selector: 'app-dashboard-recent-alerts',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './dashboard-recent-alerts.html',
  styleUrl: './dashboard-recent-alerts.css',
})
export class DashboardRecentAlerts {
  @Input({ required: true }) recentAlerts: DashboardRecentAlert[] = [];
  @Input({ required: true }) operationalAlerts: DashboardRecentAlert[] = [];

  private dialog = inject(MatDialog);

  /**
   * The backend grades telemetry alerts across all five tiers, so the raw
   * string is narrowed once here and reused for the label, the icon and the
   * badge tint — a bare `severity === 'high'` check drops `critical`,
   * `warning` and `medium` onto the low-severity styling.
   */
  severityOf(alert: DashboardRecentAlert): AlertPriority {
    return normalizeAlertPriority(alert.severity);
  }

  getSeverityKey(severity: string): string {
    return `dashboard.severity.${normalizeAlertPriority(severity)}`;
  }

  severityIcon(severity: string): string {
    return alertPriorityIcon(normalizeAlertPriority(severity));
  }

  getCategoryKey(category: string): string {
    return `monitoring.alerts.type.${category}`;
  }

  openAlertDetail(alert: DashboardRecentAlert): void {
    this.dialog.open(AlertDetailDialog, {
      data: { alert, operationalAlerts: this.operationalAlerts },
      panelClass: 'mg-dialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
