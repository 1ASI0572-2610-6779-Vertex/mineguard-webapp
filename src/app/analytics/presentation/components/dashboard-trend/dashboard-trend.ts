import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardTrend as DashboardTrendEntity } from '../../../domain/model/dashboard-trend.entity';

export type TrendPeriod = 'today' | 'week' | 'month';

/**
 * Incident-trend chart with period filter for the control-center dashboard.
 */
@Component({
  selector: 'app-dashboard-trend',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './dashboard-trend.html',
  styleUrl: './dashboard-trend.css',
})
export class DashboardTrend {
  @Input({ required: true }) trend: DashboardTrendEntity[] = [];
  @Input({ required: true }) alertTrendPath = '';
  @Input({ required: true }) incidentTrendPath = '';

  /** Emits when the user changes the period filter. */
  @Output() periodChange = new EventEmitter<TrendPeriod>();

  readonly selectedPeriod = signal<TrendPeriod>('today');

  readonly periods: { key: TrendPeriod; label: string }[] = [
    { key: 'today', label: 'Hoy' },
    { key: 'week',  label: '7 días' },
    { key: 'month', label: '30 días' },
  ];

  selectPeriod(period: TrendPeriod): void {
    this.selectedPeriod.set(period);
    this.periodChange.emit(period);
  }
}
