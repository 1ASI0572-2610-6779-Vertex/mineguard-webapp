import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardRecentAlert } from '../../../domain/model/dashboard-recent-alert.entity';

export interface AlertDetailDialogData {
  alert: DashboardRecentAlert;
}

/**
 * Modal dialog displaying the full detail of a recent alert.
 * Opened from DashboardRecentAlerts when the supervisor clicks "Atender".
 */
@Component({
  selector: 'app-alert-detail-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, TranslatePipe],
  templateUrl: './alert-detail-dialog.html',
  styleUrl: './alert-detail-dialog.css',
})
export class AlertDetailDialog {
  protected dialogRef = inject(MatDialogRef<AlertDetailDialog>);
  protected data: AlertDetailDialogData = inject(MAT_DIALOG_DATA);

  get alert(): DashboardRecentAlert {
    return this.data.alert;
  }

  getSeverityKey(severity: string): string {
    const v = severity?.toLowerCase();
    if (v === 'high')   return 'dashboard.severity.high';
    if (v === 'medium') return 'dashboard.severity.medium';
    if (v === 'low')    return 'dashboard.severity.low';
    return severity;
  }

  close(): void {
    this.dialogRef.close();
  }
}
