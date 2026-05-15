import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsStore } from '../../../application/analytics.store';
import { ReportsFatigueBars } from '../../components/reports-fatigue-bars/reports-fatigue-bars';
import { ReportsHistoryTable } from '../../components/reports-history-table/reports-history-table';
import { ReportsIncidentDistribution } from '../../components/reports-incident-distribution/reports-incident-distribution';

/**
 * Supervisor "Reportes y Analítica" view ({@link supervisor5.png} wireframe).
 *
 * @remarks
 * Composes three independent widgets sourced from {@link AnalyticsStore}:
 * the fatigue bar chart, the incident distribution donut and the historical
 * critical-events table. Each widget pulls its own slice of the store; the
 * view is just a layout shell that triggers the three on-demand loads.
 */
@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    ReportsFatigueBars,
    ReportsIncidentDistribution,
    ReportsHistoryTable,
    TranslatePipe,
  ],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css',
})
export class ReportsPage implements OnInit {
  private store = inject(AnalyticsStore);

  readonly fatigueBars = this.store.fatigueBars;
  readonly incidentDistribution = this.store.incidentDistribution;
  readonly historyRows = this.store.historyRows;

  ngOnInit(): void {
    this.store.loadFatigueBars();
    this.store.loadIncidentDistribution();
    this.store.loadHistoryRows();
  }
}
