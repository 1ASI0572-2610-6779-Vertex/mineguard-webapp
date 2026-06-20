import { Component, Input, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsIncidentDistribution } from '../../../domain/model/analytics-incident-distribution.entity';

interface DonutSegment {
  readonly id: number;
  readonly label: string;
  readonly count: number;
  readonly percent: number;
  readonly colorClass: string;
  readonly cssColor: string;
  readonly dashArray: string;
  readonly dashOffset: string;
}

/** Maps the className coming from the API to a CSS variable colour. */
const CLASS_COLOR: Record<string, string> = {
  'color-1': 'var(--color-danger-main)',
  'color-2': 'var(--color-warning-main)',
  'color-3': 'var(--color-info-main)',
  'color-4': '#6b7280',
  'color-5': 'var(--color-success-main)',
};

/**
 * Interactive donut chart of incidents grouped by operational zone.
 * Hovering a segment dims the rest and shows the hovered label in the centre.
 */
@Component({
  selector: 'app-reports-incident-distribution',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './reports-incident-distribution.html',
  styleUrl: './reports-incident-distribution.css',
})
export class ReportsIncidentDistribution {
  private readonly distributionSignal = signal<AnalyticsIncidentDistribution[]>([]);

  /** Currently hovered segment id, or null when none. */
  readonly hoveredId = signal<number | null>(null);

  @Input({ required: true }) set distribution(value: AnalyticsIncidentDistribution[]) {
    this.distributionSignal.set(value);
  }

  readonly segments = computed<DonutSegment[]>(() => {
    const items = this.distributionSignal();
    const circumference = 2 * Math.PI * 54; // r=54
    let cursor = 0;
    return items.map((item) => {
      const length = (item.percent / 100) * circumference;
      const seg: DonutSegment = {
        id: item.id,
        label: item.label,
        count: item.count,
        percent: item.percent,
        colorClass: item.className,
        cssColor: CLASS_COLOR[item.className] ?? '#6b7280',
        dashArray: `${length} ${circumference - length}`,
        dashOffset: `${-cursor}`,
      };
      cursor += length;
      return seg;
    });
  });

  readonly totalIncidents = computed(() =>
    this.distributionSignal().reduce((s, item) => s + item.count, 0),
  );

  readonly hoveredSegment = computed(() => {
    const id = this.hoveredId();
    if (id === null) return null;
    return this.segments().find((s) => s.id === id) ?? null;
  });

  isSegmentDimmed(id: number): boolean {
    const h = this.hoveredId();
    return h !== null && h !== id;
  }
}
