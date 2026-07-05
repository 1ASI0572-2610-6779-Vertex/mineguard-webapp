import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsHistoryRow } from '../../../domain/model/analytics-history-row.entity';

const PAGE_SIZE = 8;

/** Payload emitted when the user requests the export of a history row's report. */
export interface ReportDownloadRequest {
  driverId: number;
  reportId: number;
}

/**
 * "Historial de Eventos Críticos" table.
 * Supports free-text search (id / involved / location / incidentType),
 * client-side pagination and criticality badges using CSS variables.
 */
@Component({
  selector: 'app-reports-history-table',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './reports-history-table.html',
  styleUrl: './reports-history-table.css',
})
export class ReportsHistoryTable {
  @Output() readonly viewReport = new EventEmitter<ReportDownloadRequest>();

  private readonly rowsSignal = signal<AnalyticsHistoryRow[]>([]);

  readonly query = signal<string>('');
  readonly currentPage = signal<number>(0);
  readonly pageSize = PAGE_SIZE;

  @Input({ required: true }) set rows(value: AnalyticsHistoryRow[]) {
    this.rowsSignal.set(value);
    this.currentPage.set(0); // reset pagination when data changes
  }

  /** Full filtered result set (before paging). */
  readonly filteredRows = computed(() => {
    const term = this.query().trim().toLowerCase();
    const rows = this.rowsSignal();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        String(r.id).includes(term) ||
        r.involved.toLowerCase().includes(term) ||
        r.location.toLowerCase().includes(term) ||
        r.incidentType.toLowerCase().includes(term),
    );
  });

  /** Page slice shown in the table. */
  readonly pagedRows = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize)),
  );

  readonly pageLabel = computed(
    () => `Página ${this.currentPage() + 1} de ${this.totalPages()}`,
  );

  readonly canGoPrev = computed(() => this.currentPage() > 0);
  readonly canGoNext = computed(() => this.currentPage() < this.totalPages() - 1);

  onSearch(value: string): void {
    this.query.set(value);
    this.currentPage.set(0);
  }

  prevPage(): void {
    if (this.canGoPrev()) this.currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.canGoNext()) this.currentPage.update((p) => p + 1);
  }

  /**
   * A row's report can be downloaded only when the backend resolved both the
   * owning driver and a generated report for it. Either may be null (incident
   * without a trip, or without a generated report yet).
   */
  canDownload(row: AnalyticsHistoryRow): boolean {
    return row.driverId != null && row.reportId != null;
  }

  onViewReport(row: AnalyticsHistoryRow): void {
    if (row.driverId == null || row.reportId == null) return;
    this.viewReport.emit({ driverId: row.driverId, reportId: row.reportId });
  }

  criticalityIcon(level: string): string {
    if (level === 'high')   return 'crisis_alert';
    if (level === 'medium') return 'warning';
    return 'info';
  }
}
