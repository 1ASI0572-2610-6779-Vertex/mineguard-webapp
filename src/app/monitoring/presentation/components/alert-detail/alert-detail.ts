import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { Alert } from '../../../domain/model/alert.entity';
import { AlertStatus } from '../../../domain/model/alert-status';

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

  /** The backend sends occurredAt as a pre-formatted string — render it directly. */
  readonly formattedTime = computed(() => this.alertSignal()?.occurredAt ?? '');
  readonly formattedDate = computed(() => '');

  onNotesChange(value: string): void {
    this.notes.set(value);
  }

  markFalseAlarm(): void {
    if (!this.canClassify()) return;
    this.classify.emit({ status: 'reviewed', notes: this.notes() });
    this.snackBar.open('Alerta marcada como falsa alarma', 'OK', {
      duration: 3500,
      panelClass: ['mg-snack', 'mg-snack--neutral'],
    });
  }

  markResolved(): void {
    if (!this.canClassify()) return;
    this.classify.emit({ status: 'resolved', notes: this.notes() });
    this.snackBar.open('Alerta marcada como resuelta', 'OK', {
      duration: 3500,
      panelClass: ['mg-snack', 'mg-snack--success'],
    });
  }
}
