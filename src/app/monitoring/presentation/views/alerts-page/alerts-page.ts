import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { MonitoringStore } from '../../../application/monitoring.store';
import { Alert } from '../../../domain/model/alert.entity';
import { AlertStatus } from '../../../domain/model/alert-status';
import { ClassifyAlertCommand } from '../../../domain/model/classify-alert.command';
import { AlertDetail } from '../../components/alert-detail/alert-detail';
import { AlertsInbox } from '../../components/alerts-inbox/alerts-inbox';

interface DashboardAlertNavigationState {
  selectedAlertId?: number;
  selectedAlertCode?: string;
  dashboardAlerts?: unknown;
}

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [AlertsInbox, AlertDetail, MatIconModule, TranslatePipe],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css',
})
export class AlertsPage implements OnInit {
  private store = inject(MonitoringStore);
  private router = inject(Router);
  private requestedAlertId: number | null = null;
  private requestedAlertCode: string | null = null;

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
      const requested = this.findRequestedAlertId(list);
      if (requested !== null) {
        this.selectedAlertId.set(requested);
        this.requestedAlertId = null;
        this.requestedAlertCode = null;
        return;
      }
      if (currentId === null || !list.some((alert) => alert.id === currentId)) {
        this.selectedAlertId.set(list[0].id);
      }
    });
  }

  ngOnInit(): void {
    const state = this.navigationState();
    this.requestedAlertId = typeof state.selectedAlertId === 'number' ? state.selectedAlertId : null;
    this.requestedAlertCode = typeof state.selectedAlertCode === 'string' ? state.selectedAlertCode : null;

    if (Array.isArray(state.dashboardAlerts)) {
      this.store.seedAlertsFromDashboard(state.dashboardAlerts as Parameters<MonitoringStore['seedAlertsFromDashboard']>[0]);
      return;
    }

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

  private navigationState(): DashboardAlertNavigationState {
    return (this.router.getCurrentNavigation()?.extras.state ?? history.state ?? {}) as DashboardAlertNavigationState;
  }

  private findRequestedAlertId(list: Alert[]): number | null {
    if (this.requestedAlertId !== null && list.some((alert) => alert.id === this.requestedAlertId)) {
      return this.requestedAlertId;
    }
    if (this.requestedAlertCode !== null) {
      return list.find((alert) => alert.code === this.requestedAlertCode)?.id ?? null;
    }
    return null;
  }
}
