import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { MonitoringStore } from '../../../application/monitoring.store';
import { AlertStatus } from '../../../domain/model/alert-status';
import { ClassifyAlertCommand } from '../../../domain/model/classify-alert.command';
import { AlertDetail } from '../../components/alert-detail/alert-detail';
import { AlertsInbox } from '../../components/alerts-inbox/alerts-inbox';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [AlertsInbox, AlertDetail, MatIconModule, TranslatePipe],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css',
})
export class AlertsPage implements OnInit {
  private store = inject(MonitoringStore);

  readonly alerts = this.store.alerts;
  readonly selectedAlertId = signal<number | null>(null);

  readonly selectedAlert = computed(() => {
    const id = this.selectedAlertId();
    if (id === null) return null;
    return this.alerts().find((alert) => alert.id === id) ?? null;
  });

  constructor() {
    /**
     * Auto-select the first alert as soon as the inbox finishes loading
     * (matches the wireframe's initial state where AL-8942 is highlighted).
     */
    effect(() => {
      const list = this.alerts();
      if (list.length === 0) {
        this.selectedAlertId.set(null);
        return;
      }
      const currentId = this.selectedAlertId();
      if (currentId === null || !list.some((alert) => alert.id === currentId)) {
        this.selectedAlertId.set(list[0].id);
      }
    });
  }

  ngOnInit(): void {
    this.store.loadAlerts();
  }

  onAlertSelected(id: number): void {
    this.selectedAlertId.set(id);
  }

  onClassify(payload: { status: AlertStatus; notes: string }): void {
    const id = this.selectedAlertId();
    if (id === null) return;
    this.store.classifyAlert(
      new ClassifyAlertCommand({ alertId: id, status: payload.status, notes: payload.notes }),
    );
  }
}
