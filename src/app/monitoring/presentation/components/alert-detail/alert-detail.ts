import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Alert } from '../../../domain/model/alert.entity';
import { alertPriorityIcon } from '../../../domain/model/alert-priority';
import { AlertStatus } from '../../../domain/model/alert-status';
import { alertTypeIcon } from '../../../domain/model/alert-type';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule, TranslatePipe],
  templateUrl: './alert-detail.html',
  styleUrl: './alert-detail.css',
})
export class AlertDetail {
  private readonly alertSignal = signal<Alert | null>(null);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  @Input({ required: true }) set alert(value: Alert | null) {
    this.alertSignal.set(value);
    if (value) {
      this.notes.set(value.resolutionNotes ?? '');
    }
  }

  @Output() readonly classify = new EventEmitter<{ status: AlertStatus; notes: string }>();

  readonly currentAlert = this.alertSignal.asReadonly();
  readonly notes = signal<string>('');

  readonly canClassify = computed(() => {
    const alert = this.alertSignal();
    return !!alert && alert.status === 'open';
  });

  /**
   * Alerts only carry vehicle/driver attribution when a driving session was
   * `IN_PROGRESS` at the time. `emergency_sos` is raised regardless, so it can
   * arrive unattributed — say so instead of rendering an empty vehicle card.
   */
  readonly hasVehicleAttribution = computed(() => {
    const alert = this.alertSignal();
    return !!alert && (!!alert.vehicleCode || !!alert.driverName);
  });

  /** The backend sends occurredAt as a pre-formatted string — render it directly. */
  readonly formattedTime = computed(() => this.alertSignal()?.occurredAt ?? '');
  readonly formattedDate = computed(() => '');

  typeIcon(type: string): string {
    return alertTypeIcon(type);
  }

  priorityIcon(priority: string): string {
    return alertPriorityIcon(priority);
  }

  onNotesChange(value: string): void {
    this.notes.set(value);
  }

  markFalseAlarm(): void {
    if (!this.canClassify()) return;
    this.classify.emit({ status: 'reviewed', notes: this.notes() });
    this.snackBar.open(this.translate.instant('monitoring.alerts.snack.falseAlarm'), 'OK', {
      duration: 3500,
      panelClass: ['mg-snack', 'mg-snack--neutral'],
    });
  }

  markResolved(): void {
    if (!this.canClassify()) return;
    this.classify.emit({ status: 'resolved', notes: this.notes() });
    this.snackBar.open(this.translate.instant('monitoring.alerts.snack.resolved'), 'OK', {
      duration: 3500,
      panelClass: ['mg-snack', 'mg-snack--success'],
    });
  }
}
