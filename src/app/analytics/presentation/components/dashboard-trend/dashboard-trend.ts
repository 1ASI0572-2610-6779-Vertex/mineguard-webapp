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

  /**
   * Whether the incidents series carries real data. False while the backend's
   * `Incident` projection is empty, in which case the line and its legend entry
   * are hidden rather than drawn flat at zero.
   */
  @Input() hasIncidentSeries = false;

  /** Emits when the user changes the period filter. */
  @Output() periodChange = new EventEmitter<TrendPeriod>();

  readonly selectedPeriod = signal<TrendPeriod>('today');

  // Labels are i18n keys resolved with the `translate` pipe in the template.
  readonly periods: { key: TrendPeriod; label: string }[] = [
    { key: 'today', label: 'dashboard.trend.today' },
    { key: 'week',  label: 'dashboard.trend.week' },
    { key: 'month', label: 'dashboard.trend.month' },
  ];

  selectPeriod(period: TrendPeriod): void {
    this.selectedPeriod.set(period);
    this.periodChange.emit(period);
  }
}
