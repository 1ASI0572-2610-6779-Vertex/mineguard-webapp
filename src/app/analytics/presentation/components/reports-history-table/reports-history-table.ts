import { Component, Input, computed, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsHistoryRow } from '../../../domain/model/analytics-history-row.entity';

/**
 * "Historial de Eventos Críticos" table surfaced by the supervisor
 * "Reportes y Analítica" view. Includes a free-text filter applied on
 * id / driver / location columns.
 */
@Component({
  selector: 'app-reports-history-table',
  standalone: true,
  imports: [MatButton, MatIcon, TranslatePipe],
  templateUrl: './reports-history-table.html',
  styleUrl: './reports-history-table.css',
})
export class ReportsHistoryTable {
  private readonly rowsSignal = signal<AnalyticsHistoryRow[]>([]);
  readonly query = signal<string>('');

  @Input({ required: true }) set rows(value: AnalyticsHistoryRow[]) {
    this.rowsSignal.set(value);
  }

  readonly filteredRows = computed(() => {
    const term = this.query().trim().toLowerCase();
    const rows = this.rowsSignal();
    if (!term) return rows;
    return rows.filter(
      (row) =>
        String(row.id).includes(term) ||
        row.involved.toLowerCase().includes(term) ||
        row.location.toLowerCase().includes(term) ||
        row.incidentType.toLowerCase().includes(term),
    );
  });

  onSearch(value: string): void {
    this.query.set(value);
  }
}
