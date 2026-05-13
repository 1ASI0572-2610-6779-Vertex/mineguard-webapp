import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, map, shareReplay } from 'rxjs';

import { AnalyticsService } from '../../infrastructure/analytics.service';

import { AnalyticsIncidentDistribution } from '../../domain/analytics.model';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-page" id="reports-content">
      <ng-container *ngIf="viewModel$ | async as vm">
        <header class="page-header no-print">
          <div>
            <h1>Reportes y Analítica Histórica</h1>
            <p>Análisis de patrones de seguridad y exportación de datos</p>
          </div>

          <div class="header-actions">
            <select>
              <option>Últimos 30 días</option>
            </select>

            <button class="export-btn" (click)="exportToPdf()">⬇ Exportar PDF</button>
          </div>
        </header>

        <header class="print-header print-only">
          <h1>Reporte MineGuard</h1>
          <p>Reportes y Analítica Histórica</p>
          <span>Generado: {{ today | date: 'medium' }}</span>
        </header>

        <main class="content">
          <section class="insights-card">
            <h2>⚡ Insights automáticos del sistema</h2>

            <div class="insights-grid">
              <div
                class="insight-box"
                *ngFor="let insight of vm.insights"
                [class]="insight.className"
              >


                <div>
                  <h3>{{ insight.title }}</h3>
                  <p>{{ insight.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="charts-grid">
            <div class="chart-card">
              <div class="card-title-row">
                <div>
                  <h2>Análisis de Fatiga por Conductor</h2>
                  <p>Acumulado según métricas registradas</p>
                </div>
                <button class="small-export no-print">⬇</button>
              </div>

              <div class="bar-chart">
                <div class="bar-row" *ngFor="let item of vm.fatigueBars">
                  <span class="bar-label">{{ item.driverName }}</span>

                  <div class="bar-track">
                    <div class="bar-fill" [style.width.%]="item.width"></div>
                  </div>

                  <strong>{{ item.fatigueEvents }}</strong>
                </div>

                <p class="empty" *ngIf="vm.fatigueBars.length === 0">
                  No hay métricas de fatiga registradas.
                </p>
              </div>
            </div>

            <div class="chart-card">
              <div class="card-title-row">
                <div>
                  <h2>Distribución de Incidentes</h2>
                  <p>Alertas agrupadas por tipo de riesgo</p>
                </div>
                <button class="small-export no-print">⬇</button>
              </div>

              <div class="donut-layout">
                <div class="donut" [style.background]="vm.distributionGradient">
                  <div class="donut-hole"></div>
                </div>

                <div class="legend">
                  <div class="legend-item" *ngFor="let item of vm.distribution">
                    <span class="legend-dot" [class]="item.className"></span>
                    <span>{{ item.label }}</span>
                    <strong>{{ item.count }}</strong>
                  </div>
                </div>
              </div>

              <p class="empty" *ngIf="vm.distribution.length === 0">
                No hay alertas para distribuir.
              </p>
            </div>
          </section>

          <section class="history-card">
            <div class="history-header">
              <div>
                <h2>Historial de Eventos Críticos</h2>
                <p>Registro inmutable para auditorías de seguridad</p>
              </div>

              <div class="history-tools no-print">
                <div class="filter-input">🔎 Filtrar por ID, Conductor o Zona</div>
                <button>⚱ Filtros</button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Criticidad</th>
                  <th>Tipo de incidente</th>
                  <th>Involucrados</th>
                  <th>Ubicación</th>
                  <th>Acción / detalles</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let row of vm.historyRows">
                  <td>
                    <strong>{{ row.date }}</strong>
                    <span>{{ row.time }}</span>
                  </td>

                  <td>
                    <span
                      class="criticality-badge"
                      [class.critical]="row.criticality === 'high'"
                      [class.preventive]="row.criticality === 'medium'"
                      [class.system]="row.criticality === 'low'"
                    >
                      {{ row.criticalityLabel }}
                    </span>
                  </td>

                  <td>
                    <strong>{{ row.incidentType }}</strong>
                  </td>

                  <td>
                    <strong>{{ row.involved }}</strong>
                  </td>

                  <td>
                    <strong>{{ row.location }}</strong>
                  </td>

                  <td>
                    <a class="report-link">Ver Reporte</a>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="pagination no-print">
              <span
                >Mostrando 1 a {{ vm.historyRows.length }} de {{ vm.totalRecords }} registros</span
              >

              <div>
                <button disabled>Anterior</button>
                <button class="active">1</button>
                <button>2</button>
                <button>Siguiente</button>
              </div>
            </div>
          </section>
        </main>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .reports-page {
        min-height: 100vh;
        background: #f4f4f5;
        color: #111827;
        font-family: Arial, sans-serif;
      }

      .page-header {
        height: 64px;
        background: white;
        border-bottom: 1px solid #d1d5db;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
      }

      .page-header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 800;
      }

      .page-header p {
        margin: 3px 0 0;
        font-size: 13px;
        color: #64748b;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      select {
        height: 34px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 0 12px;
        background: white;
        font-weight: 700;
      }

      .export-btn {
        height: 36px;
        border: none;
        border-radius: 7px;
        background: #16a34a;
        color: white;
        font-weight: 800;
        padding: 0 20px;
        cursor: pointer;
      }

      .content {
        padding: 28px 24px 40px;
      }

      .insights-card {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 12px;
        padding: 22px;
        margin-bottom: 22px;
        box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);
      }

      .insights-card h2 {
        margin: 0 0 18px;
        color: #2563eb;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .insights-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 18px;
      }

      .insight-box {
        background: white;
        border-radius: 10px;
        padding: 18px;

      }


      .fatigue-insight .insight-icon {
        background: #fef3c7;
        color: #f59e0b;
      }

      .zone-insight .insight-icon {
        background: #fee2e2;
        color: #dc2626;
      }

      .insight-box h3 {
        margin: 0 0 6px;
        font-size: 14px;
        font-weight: 800;
      }

      .insight-box p {
        margin: 0;
        font-size: 12px;
        color: #64748b;
        line-height: 1.5;
        font-weight: 600;
      }

      .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 22px;
        margin-bottom: 22px;
      }

      .chart-card,
      .history-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .chart-card {
        padding: 24px;
        min-height: 270px;
      }

      .card-title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 28px;
      }

      .card-title-row h2,
      .history-header h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 800;
      }

      .card-title-row p,
      .history-header p {
        margin: 6px 0 0;
        font-size: 12px;
        color: #64748b;
        font-weight: 600;
      }

      .small-export {
        border: 1px solid #e5e7eb;
        background: white;
        border-radius: 8px;
        width: 34px;
        height: 34px;
        cursor: pointer;
      }

      .bar-chart {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .bar-row {
        display: grid;
        grid-template-columns: 120px 1fr 30px;
        align-items: center;
        gap: 10px;
      }

      .bar-label {
        font-size: 12px;
        color: #64748b;
        font-weight: 700;
      }

      .bar-track {
        height: 18px;
        background: #f1f5f9;
        border-radius: 4px;
        overflow: hidden;
      }

      .bar-fill {
        height: 100%;
        background: #f59e0b;
        border-radius: 4px;
      }

      .bar-row strong {
        font-size: 12px;
        color: #64748b;
      }

      .donut-layout {
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 24px;
        align-items: center;
      }

      .donut {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        display: grid;
        place-items: center;
      }

      .donut-hole {
        width: 86px;
        height: 86px;
        background: white;
        border-radius: 50%;
      }

      .legend {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .legend-item {
        display: grid;
        grid-template-columns: 16px 1fr auto;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #64748b;
        font-weight: 700;
      }

      .legend-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }

      .color-1 {
        background: #dc2626;
      }
      .color-2 {
        background: #f59e0b;
      }
      .color-3 {
        background: #3b82f6;
      }
      .color-4 {
        background: #9ca3af;
      }

      .history-card {
        overflow: hidden;
      }

      .history-header {
        padding: 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .history-tools {
        display: flex;
        gap: 10px;
      }

      .filter-input {
        width: 260px;
        height: 38px;
        border: 1px solid #e5e7eb;
        border-radius: 7px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 700;
      }

      .history-tools button {
        border: 1px solid #e5e7eb;
        background: white;
        border-radius: 7px;
        padding: 0 18px;
        font-weight: 800;
        cursor: pointer;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        text-align: left;
        padding: 16px 22px;
        background: #f8fafc;
        color: #64748b;
        font-size: 11px;
        text-transform: uppercase;
        border-top: 1px solid #e5e7eb;
        border-bottom: 1px solid #e5e7eb;
      }

      td {
        padding: 20px 22px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 13px;
        vertical-align: middle;
      }

      td strong {
        display: block;
        font-weight: 800;
        color: #111827;
      }

      td span {
        display: block;
        margin-top: 5px;
        color: #64748b;
        font-size: 12px;
      }

      .criticality-badge {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .critical {
        background: #fee2e2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }

      .preventive {
        background: #fef3c7;
        color: #b45309;
        border: 1px solid #fde68a;
      }

      .system {
        background: #f1f5f9;
        color: #64748b;
        border: 1px solid #e2e8f0;
      }

      .report-link {
        color: #2563eb;
        font-weight: 800;
        text-decoration: none;
        cursor: pointer;
      }

      .pagination {
        padding: 16px 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #64748b;
        font-size: 13px;
      }

      .pagination button {
        border: 1px solid #e5e7eb;
        background: white;
        padding: 8px 12px;
        cursor: pointer;
        font-weight: 700;
      }

      .pagination button.active {
        background: #2563eb;
        color: white;
      }

      .pagination button:disabled {
        color: #cbd5e1;
        cursor: not-allowed;
      }

      .empty {
        margin: 0;
        color: #64748b;
        font-size: 13px;
      }

      .print-only {
        display: none;
      }

      @media (max-width: 1000px) {
        .page-header {
          height: auto;
          padding: 18px;
          align-items: flex-start;
          flex-direction: column;
          gap: 16px;
        }

        .header-actions {
          width: 100%;
        }

        .export-btn,
        select {
          flex: 1;
        }

        .charts-grid,
        .insights-grid {
          grid-template-columns: 1fr;
        }

        .donut-layout {
          grid-template-columns: 1fr;
          justify-items: center;
        }

        .history-header {
          align-items: flex-start;
          flex-direction: column;
          gap: 16px;
        }

        .history-card {
          overflow-x: auto;
        }

        table {
          min-width: 800px;
        }
      }

      @media print {
        .no-print {
          display: none !important;
        }

        .print-only {
          display: block;
        }

        .reports-page {
          background: white;
        }

        .content {
          padding: 10px;
        }

        .chart-card,
        .history-card,
        .insights-card {
          box-shadow: none;
          break-inside: avoid;
        }

        .charts-grid {
          grid-template-columns: 1fr 1fr;
        }

        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  ],
})
export class ReportsPageComponent {
  private analyticsService = inject(AnalyticsService);

  today = new Date();

  viewModel$ = forkJoin({
    fatigueBars: this.analyticsService.getAnalyticsFatigueBars(),
    distribution: this.analyticsService.getAnalyticsIncidentDistribution(),
    historyRows: this.analyticsService.getAnalyticsHistoryRows(),
    insights: this.analyticsService.getAnalyticsInsights(),
  }).pipe(
    map((data) => {
      return {
        fatigueBars: data.fatigueBars,
        distribution: data.distribution,
        distributionGradient: this.buildDistributionGradient(data.distribution),
        historyRows: data.historyRows,
        totalRecords: data.historyRows.length,
        insights: data.insights,
      };
    }),
    shareReplay(1),
  );

  exportToPdf(): void {
    window.print();
  }

  buildDistributionGradient(items: AnalyticsIncidentDistribution[]): string {
    if (items.length === 0) {
      return 'conic-gradient(#e5e7eb 0deg 360deg)';
    }

    const colors: Record<string, string> = {
      'color-1': '#dc2626',
      'color-2': '#f59e0b',
      'color-3': '#3b82f6',
      'color-4': '#9ca3af',
    };

    let current = 0;

    const parts = items.map((item) => {
      const start = current;
      const end = current + item.percent * 3.6;
      current = end;

      return `${colors[item.className]} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${parts.join(', ')})`;
  }
}
