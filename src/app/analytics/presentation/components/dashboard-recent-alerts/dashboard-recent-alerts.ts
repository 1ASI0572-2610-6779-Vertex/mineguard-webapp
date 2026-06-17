import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

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

  private dialog = inject(MatDialog);

  getSeverityKey(severity: string): string {
    const v = severity?.toLowerCase();
    if (v === 'high')   return 'dashboard.severity.high';
    if (v === 'medium') return 'dashboard.severity.medium';
    if (v === 'low')    return 'dashboard.severity.low';
    return severity;
  }

  openAlertDetail(alert: DashboardRecentAlert): void {
    this.dialog.open(AlertDetailDialog, {
      data: { alert },
      panelClass: 'mg-dialog',
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
