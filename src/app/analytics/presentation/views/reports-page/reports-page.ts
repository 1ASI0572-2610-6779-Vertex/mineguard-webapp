import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsStore } from '../../../application/analytics.store';
import { ReportsFatigueBars } from '../../components/reports-fatigue-bars/reports-fatigue-bars';
import { ReportsHistoryTable } from '../../components/reports-history-table/reports-history-table';
import { ReportsIncidentDistribution } from '../../components/reports-incident-distribution/reports-incident-distribution';

/**
 * Supervisor "Reportes y Analítica" view.
 * Hosts the global filter toolbar, charts grid and historical events table.
 */
@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
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
  private readonly allHistoryRows = this.store.historyRows;

  readonly criticalityFilter = signal<string>('all');

  readonly criticalityOptions = [
    { value: 'all',    label: 'Todos los niveles' },
    { value: 'high',   label: 'Crítico' },
    { value: 'medium', label: 'Medio' },
    { value: 'low',    label: 'Bajo' },
  ];

  /** Rows filtered by the page-level criticality dropdown */
  readonly filteredHistoryRows = computed(() => {
    const rows = this.allHistoryRows();
    const crit = this.criticalityFilter();
    if (crit === 'all') return rows;
    return rows.filter((r) => r.criticality === crit);
  });

  readonly totalFiltered = computed(() => this.filteredHistoryRows().length);

  ngOnInit(): void {
    this.store.loadFatigueBars();
    this.store.loadIncidentDistribution();
    this.store.loadHistoryRows();
  }

  /** Generates and downloads a CSV of the currently filtered history rows. */
  exportCsv(): void {
    const rows = this.filteredHistoryRows();
    if (!rows.length) return;

    const headers = ['ID', 'Fecha', 'Hora', 'Criticidad', 'Tipo de Incidente', 'Implicados', 'Ubicación'];
    const csvRows = [
      headers.join(','),
      ...rows.map((r) =>
        [r.id, r.date, r.time, r.criticalityLabel, r.incidentType, r.involved, r.location]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(','),
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `mineguard-incidentes-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
