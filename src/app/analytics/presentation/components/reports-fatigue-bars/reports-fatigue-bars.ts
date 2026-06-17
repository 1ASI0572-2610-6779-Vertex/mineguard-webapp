import { Component, Input, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsFatigueBar } from '../../../domain/model/analytics-fatigue-bar.entity';

/**
 * Horizontal bar chart of accumulated fatigue events per driver.
 * Bars are coloured by severity rank and support hover tooltips.
 */
@Component({
  selector: 'app-reports-fatigue-bars',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './reports-fatigue-bars.html',
  styleUrl: './reports-fatigue-bars.css',
})
export class ReportsFatigueBars {
  private readonly barsSignal = signal<AnalyticsFatigueBar[]>([]);

  /** ID of the bar row currently under the pointer — drives the dim effect. */
  readonly hoveredId = signal<number | null>(null);

  @Input({ required: true }) set bars(value: AnalyticsFatigueBar[]) {
    this.barsSignal.set(value);
  }

  readonly maxFatigueEvents = computed(() => {
    const all = this.barsSignal();
    return Math.max(1, ...all.map((b) => b.fatigueEvents));
  });

  readonly visibleBars = this.barsSignal.asReadonly();

  widthFor(events: number): number {
    return Math.round((events / this.maxFatigueEvents()) * 100);
  }

  /** Returns a semantic colour class based on position in the ranked list. */
  barColorClass(index: number): string {
    if (index === 0) return 'bar--danger';
    if (index === 1) return 'bar--warning';
    if (index === 2) return 'bar--warning-light';
    return 'bar--info';
  }

  isDimmed(id: number): boolean {
    const h = this.hoveredId();
    return h !== null && h !== id;
  }
}
