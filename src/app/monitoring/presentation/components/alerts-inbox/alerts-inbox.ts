import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Alert } from '../../../domain/model/alert.entity';

/**
 * Left-hand "Bandeja de incidentes" list for the supervisor
 * "Gestión de Alertas" view.
 *
 * @remarks
 * Stateless presentational component: receives the alerts and the currently
 * selected ID, emits a selection event to the parent page.
 */
@Component({
  selector: 'app-alerts-inbox',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './alerts-inbox.html',
  styleUrl: './alerts-inbox.css',
})
export class AlertsInbox {
  @Input({ required: true }) alerts: Alert[] = [];
  @Input() selectedAlertId: number | null = null;
  @Output() readonly alertSelected = new EventEmitter<number>();

  /**
   * Returns a coarse-grained elapsed-time string ("Hace N min" / "Hace N h"
   * / "Hace N d") from an ISO timestamp. Anchored to "now" at render time.
   */
  elapsedFor(isoTimestamp: string): { value: number; unit: 'minutes' | 'hours' | 'days' } {
    const occurred = new Date(isoTimestamp).getTime();
    const now = Date.now();
    if (Number.isNaN(occurred)) return { value: 0, unit: 'minutes' };
    const diffMs = Math.max(0, now - occurred);
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return { value: minutes, unit: 'minutes' };
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return { value: hours, unit: 'hours' };
    return { value: Math.floor(hours / 24), unit: 'days' };
  }

  selectAlert(id: number): void {
    this.alertSelected.emit(id);
  }
}
