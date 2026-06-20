import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { Alert } from '../../../domain/model/alert.entity';

type StatusFilter = 'all' | 'open' | 'reviewed' | 'resolved';
type PriorityFilter = 'all' | 'critical' | 'high';
type SortMode = 'date-desc' | 'date-asc' | 'priority';

@Component({
  selector: 'app-alerts-inbox',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './alerts-inbox.html',
  styleUrl: './alerts-inbox.css',
})
export class AlertsInbox {
  private readonly alertsSignal = signal<Alert[]>([]);

  @Input({ required: true }) set alerts(value: Alert[]) {
    this.alertsSignal.set(value);
  }
  @Input() selectedAlertId: number | null = null;
  @Output() readonly alertSelected = new EventEmitter<number>();

  readonly statusFilter = signal<StatusFilter>('all');
  readonly priorityFilter = signal<PriorityFilter>('all');
  readonly sortMode = signal<SortMode>('date-desc');

  readonly statusPills: { key: StatusFilter; label: string }[] = [
    { key: 'all',      label: 'Todas' },
    { key: 'open',     label: 'Abiertas' },
    { key: 'reviewed', label: 'Revisadas' },
    { key: 'resolved', label: 'Resueltas' },
  ];

  readonly priorityPills: { key: PriorityFilter; label: string }[] = [
    { key: 'all',      label: 'Todas' },
    { key: 'critical', label: 'Crítico' },
    { key: 'high',     label: 'Alta' },
  ];

  readonly statusCounts = computed(() => {
    const all = this.alertsSignal();
    return {
      all:      all.length,
      open:     all.filter((a) => a.status === 'open').length,
      reviewed: all.filter((a) => a.status === 'reviewed').length,
      resolved: all.filter((a) => a.status === 'resolved').length,
      critical: all.filter((a) => a.priority === 'critical').length,
      high:     all.filter((a) => a.priority === 'high').length,
    };
  });

  readonly filteredAlerts = computed(() => {
    let list = this.alertsSignal();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const sort = this.sortMode();

    if (status !== 'all') list = list.filter((a) => a.status === status);
    if (priority !== 'all') list = list.filter((a) => a.priority === priority);

    return [...list].sort((a, b) => {
      if (sort === 'priority') {
        const pa = a.priority === 'critical' ? 0 : 1;
        const pb = b.priority === 'critical' ? 0 : 1;
        return pa - pb || new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      }
      const ta = new Date(a.occurredAt).getTime();
      const tb = new Date(b.occurredAt).getTime();
      return sort === 'date-desc' ? tb - ta : ta - tb;
    });
  });

  isPulsing(alert: Alert): boolean {
    return alert.priority === 'critical' && alert.status === 'open';
  }

  typeIcon(type: string): string {
    if (type === 'fatigue_risk') return 'bedtime';
    if (type === 'high_heart_rate') return 'favorite';
    if (type === 'restricted_zone_entry') return 'do_not_enter';
    if (type === 'connection_lost') return 'signal_wifi_off';
    return 'car_crash'; // proximity_collision
  }

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
