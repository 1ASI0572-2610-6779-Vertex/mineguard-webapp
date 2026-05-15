import { Component, Input, computed, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsIncidentDistribution } from '../../../domain/model/analytics-incident-distribution.entity';

interface DonutSegment {
  readonly id: number;
  readonly label: string;
  readonly count: number;
  readonly percent: number;
  readonly colorClass: string;
  readonly dashArray: string;
  readonly dashOffset: string;
}

/**
 * Donut chart of incidents grouped by operational zone, surfaced by the
 * supervisor "Reportes y Analítica" view.
 *
 * @remarks
 * Rendered as inline SVG with `stroke-dasharray` to avoid pulling in a chart
 * library when a 5-segment donut is all we need.
 */
@Component({
  selector: 'app-reports-incident-distribution',
  standalone: true,
  imports: [MatIconButton, MatIcon, TranslatePipe],
  templateUrl: './reports-incident-distribution.html',
  styleUrl: './reports-incident-distribution.css',
})
export class ReportsIncidentDistribution {
  private readonly distributionSignal = signal<AnalyticsIncidentDistribution[]>([]);

  @Input({ required: true }) set distribution(value: AnalyticsIncidentDistribution[]) {
    this.distributionSignal.set(value);
  }

  readonly segments = computed<DonutSegment[]>(() => {
    const items = this.distributionSignal();
    const circumference = 2 * Math.PI * 60; // r=60
    let cursor = 0;
    return items.map((item) => {
      const length = (item.percent / 100) * circumference;
      const segment: DonutSegment = {
        id: item.id,
        label: item.label,
        count: item.count,
        percent: item.percent,
        colorClass: item.className,
        dashArray: `${length} ${circumference - length}`,
        dashOffset: `${-cursor}`,
      };
      cursor += length;
      return segment;
    });
  });

  readonly totalIncidents = computed(() =>
    this.distributionSignal().reduce((sum, item) => sum + item.count, 0),
  );
}
