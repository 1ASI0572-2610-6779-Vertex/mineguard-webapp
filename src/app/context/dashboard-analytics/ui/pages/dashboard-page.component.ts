import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, map, shareReplay } from 'rxjs';

import { AnalyticsService } from '../../infrastructure/analytics.service';
import { DashboardTrend } from '../../domain/analytics.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="control-page">
      <ng-container *ngIf="summary$ | async as s">
        <div class="topbar">
          <div>
            <h1>Centro de Control Operativo</h1>
            <p>Monitoreo en tiempo real de la operación minera</p>
          </div>

          <div class="topbar-status">
            <span class="sensor-dot"></span>
            Sensores ({{ s.activeSensors }} / {{ s.totalSensors }})
            <span class="bell">🔔</span>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div>
              <h3>Alertas críticas</h3>
              <p>{{ s.criticalAlerts }}</p>
            </div>
            <div class="icon red">⚠</div>
          </div>

          <div class="stat-card">
            <div>
              <h3>Eventos fatiga</h3>
              <p>{{ s.fatigueEvents }}</p>
            </div>
            <div class="icon orange">⌁</div>
          </div>

          <div class="stat-card">
            <div>
              <h3>Vehículos activos</h3>
              <p>{{ s.activeVehicles }}</p>
            </div>
            <div class="icon blue">🚙</div>
          </div>

          <div class="stat-card">
            <div>
              <h3>Conductores en campo</h3>
              <p>{{ s.totalDrivers }}</p>
            </div>
            <div class="icon violet">👥</div>
          </div>
        </div>

        <div class="middle-grid">
          <div class="chart-card">
            <div class="card-header">
              <h2>Tendencia de incidentes</h2>
              <select>
                <option>Hoy</option>
              </select>
            </div>

            <div class="fake-chart">
              <div class="chart-lines">
                <svg viewBox="0 0 700 170" preserveAspectRatio="none">
                  <path [attr.d]="s.alertTrendPath" fill="none" stroke="#3b82f6" stroke-width="4" />

                  <path
                    [attr.d]="s.incidentTrendPath"
                    fill="none"
                    stroke="#f59e0b"
                    stroke-width="4"
                  />
                </svg>
              </div>

              <div class="chart-labels">
                <span *ngFor="let item of s.trend">{{ item.hour }}</span>
              </div>

              <div class="chart-legend">
                <span><b class="blue-dot"></b> Alertas</span>
                <span><b class="orange-dot"></b> Incidentes</span>
              </div>
            </div>
          </div>

          <div class="risk-card">
            <div class="risk-title">
              <span>👥</span>
              <h2>Conductores en Riesgo</h2>
            </div>

            <div class="risk-list">
              <div class="risk-item" *ngFor="let metric of s.topRiskDrivers; let i = index">
                <div class="rank" [class.rank-red]="i === 0" [class.rank-orange]="i === 1">
                  {{ i + 1 }}
                </div>

                <div class="driver-info">
                  <strong>{{ metric.driverName }}</strong>
                  <span>{{ metric.vehicleType }}</span>
                </div>

                <strong
                  class="points"
                  [class.high]="metric.riskScore >= 70"
                  [class.medium]="metric.riskScore >= 50 && metric.riskScore < 70"
                >
                  {{ metric.riskScore | number: '1.0-0' }} pts
                </strong>
              </div>
            </div>

            <button class="report-btn">Ver reporte completo</button>
          </div>
        </div>

        <div class="alerts-card">
          <div class="alerts-title">
            <span>⌁</span>
            <h2>Registro de alertas en vivo</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID Alerta</th>
                <th>Nivel</th>
                <th>Categoría</th>
                <th>Implicados</th>
                <th>Ruta / Hora</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let alert of s.recentAlerts">
                <td>
                  <strong>{{ alert.alertCode }}</strong>
                </td>

                <td>
                  <span
                    class="badge"
                    [class.badge-red]="alert.severity === 'high'"
                    [class.badge-yellow]="alert.severity === 'medium'"
                    [class.badge-green]="alert.severity === 'low'"
                  >
                    {{ getSeverityLabel(alert.severity) }}
                  </span>
                </td>

                <td>
                  <strong>{{ alert.category }}</strong>
                </td>

                <td>
                  <strong>{{ alert.driverName }}</strong>
                  <span>{{ alert.vehicleType }} - {{ alert.vehicleCode }}</span>
                </td>

                <td>
                  <strong>{{ alert.route }}</strong>
                  <span>{{ alert.time }}</span>
                </td>

                <td>
                  <button class="action-btn" [class.resolved]="alert.status !== 'active'">
                    {{ alert.status === 'active' ? 'Atender' : 'Resuelto' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .control-page {
        padding: 0;
        background: #f4f4f5;
        min-height: 100vh;
        color: #171717;
        font-family: Arial, sans-serif;
      }

      .topbar {
        height: 68px;
        background: white;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 32px;
      }

      .topbar h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 800;
      }

      .topbar p {
        margin: 4px 0 0;
        font-size: 13px;
        color: #333;
      }

      .topbar-status {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #f4f4f5;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
      }

      .sensor-dot {
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        display: inline-block;
      }

      .bell {
        margin-left: 20px;
        font-size: 18px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        padding: 18px;
      }

      .stat-card {
        background: white;
        border-radius: 14px;
        padding: 22px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .stat-card h3 {
        margin: 0 0 12px;
        text-transform: uppercase;
        font-size: 12px;
        color: #555;
      }

      .stat-card p {
        margin: 0;
        font-size: 28px;
        font-weight: 800;
      }

      .icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: grid;
        place-items: center;
        font-size: 20px;
      }

      .red {
        background: #fee2e2;
        color: #dc2626;
      }

      .orange {
        background: #fef3c7;
        color: #f59e0b;
      }

      .blue {
        background: #dbeafe;
        color: #2563eb;
      }

      .violet {
        background: #e0e7ff;
        color: #4f46e5;
      }

      .middle-grid {
        display: grid;
        grid-template-columns: 2fr 1.05fr;
        gap: 14px;
        padding: 0 18px 18px;
      }

      .chart-card,
      .risk-card,
      .alerts-card {
        background: white;
        border-radius: 14px;
      }

      .chart-card {
        padding: 22px;
        min-height: 250px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-header h2,
      .risk-title h2,
      .alerts-title h2 {
        font-size: 14px;
        margin: 0;
        font-weight: 800;
      }

      select {
        border: none;
        background: #f4f4f5;
        padding: 8px 30px;
        border-radius: 7px;
        font-size: 12px;
      }

      .fake-chart {
        margin-top: 20px;
        height: 190px;
        position: relative;
        background-image:
          linear-gradient(to bottom, transparent 24%, #eee 25%, transparent 26%),
          linear-gradient(to bottom, transparent 49%, #eee 50%, transparent 51%),
          linear-gradient(to bottom, transparent 74%, #eee 75%, transparent 76%);
      }

      .chart-lines {
        height: 140px;
      }

      .chart-lines svg {
        width: 100%;
        height: 100%;
      }

      .chart-labels {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #888;
        margin-top: 5px;
      }

      .chart-legend {
        margin-top: 12px;
        display: flex;
        gap: 18px;
        font-size: 12px;
        color: #555;
      }

      .blue-dot,
      .orange-dot {
        width: 9px;
        height: 9px;
        display: inline-block;
        border-radius: 50%;
        margin-right: 6px;
      }

      .blue-dot {
        background: #3b82f6;
      }

      .orange-dot {
        background: #f59e0b;
      }

      .risk-card {
        padding: 22px;
      }

      .risk-title,
      .alerts-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 18px;
      }

      .risk-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .risk-item {
        display: grid;
        grid-template-columns: 36px 1fr auto;
        align-items: center;
        gap: 12px;
        background: #f8fafc;
        padding: 12px;
        border-radius: 10px;
      }

      .rank {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: white;
        display: grid;
        place-items: center;
        font-weight: 800;
        font-size: 12px;
      }

      .rank-red {
        background: #dc2626;
        color: white;
      }

      .rank-orange {
        background: #f59e0b;
        color: white;
      }

      .driver-info {
        display: flex;
        flex-direction: column;
      }

      .driver-info strong {
        font-size: 12px;
      }

      .driver-info span {
        font-size: 10px;
        color: #555;
        font-weight: 700;
      }

      .points {
        font-size: 12px;
      }

      .points.high {
        color: #dc2626;
      }

      .points.medium {
        color: #f59e0b;
      }

      .report-btn {
        margin-top: 20px;
        width: 100%;
        border: none;
        border-radius: 8px;
        background: #eff6ff;
        color: #1d4ed8;
        font-weight: 800;
        padding: 12px;
        cursor: pointer;
      }

      .alerts-card {
        margin: 0 18px 24px;
        overflow: hidden;
      }

      .alerts-title {
        padding: 20px 22px;
        margin: 0;
        border-bottom: 1px solid #eee;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        text-align: left;
        font-size: 10px;
        text-transform: uppercase;
        color: #666;
        padding: 16px 22px;
        border-bottom: 1px solid #eee;
      }

      td {
        padding: 16px 22px;
        border-bottom: 1px solid #eee;
        font-size: 12px;
        vertical-align: middle;
      }

      td span {
        display: block;
        color: #555;
        font-size: 11px;
        margin-top: 3px;
      }

      .badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 700;
      }

      .badge-red {
        background: #fee2e2;
        color: #dc2626;
      }

      .badge-yellow {
        background: #fef3c7;
        color: #f59e0b;
      }

      .badge-green {
        background: #dcfce7;
        color: #15803d;
      }

      .action-btn {
        border: none;
        background: #b91c1c;
        color: white;
        padding: 7px 14px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
      }

      .action-btn.resolved {
        background: #f3f4f6;
        color: #777;
      }

      @media (max-width: 1000px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .middle-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 600px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .topbar {
          height: auto;
          padding: 18px;
          align-items: flex-start;
          flex-direction: column;
          gap: 12px;
        }

        table {
          min-width: 800px;
        }

        .alerts-card {
          overflow-x: auto;
        }
      }
    `,
  ],
})
export class DashboardPageComponent {
  private analytics = inject(AnalyticsService);

  summary$ = forkJoin({
    summary: this.analytics.getDashboardSummary(),
    trend: this.analytics.getDashboardTrend(),
    riskDrivers: this.analytics.getDashboardRiskDrivers(),
    recentAlerts: this.analytics.getDashboardRecentAlerts(),
  }).pipe(
    map((data) => {
      const summary = data.summary[0];

      return {
        activeSensors: summary.activeSensors,
        totalSensors: summary.totalSensors,
        criticalAlerts: summary.criticalAlerts,
        fatigueEvents: summary.fatigueEvents,
        activeVehicles: summary.activeVehicles,
        totalDrivers: summary.totalDrivers,
        recentAlerts: data.recentAlerts,
        topRiskDrivers: data.riskDrivers,
        trend: data.trend,
        alertTrendPath: this.buildPath(data.trend, 'alerts'),
        incidentTrendPath: this.buildPath(data.trend, 'incidents'),
      };
    }),
    shareReplay(1),
  );

  buildPath(trend: DashboardTrend[], key: 'alerts' | 'incidents'): string {
    if (!trend.length) {
      return '';
    }

    const maxValue = Math.max(
      ...trend.map((item) => item.alerts),
      ...trend.map((item) => item.incidents),
      1,
    );

    const width = 700;
    const height = 130;
    const topPadding = 10;

    return trend
      .map((item, index) => {
        const x = index * (width / (trend.length - 1));
        const y = height - (item[key] / maxValue) * height + topPadding;

        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }

  getSeverityLabel(severity: string): string {
    const value = severity?.toLowerCase();

    if (value === 'high') {
      return 'Crítica';
    }

    if (value === 'medium') {
      return 'Media';
    }

    if (value === 'low') {
      return 'Baja';
    }

    return severity;
  }
}
