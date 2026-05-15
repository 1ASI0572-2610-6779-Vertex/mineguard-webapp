import { Component, Input, computed, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AnalyticsFatigueBar } from '../../../domain/model/analytics-fatigue-bar.entity';

/**
 * Horizontal bar chart of accumulated fatigue events per driver,
 * surfaced by the supervisor "Reportes y Analítica" view.
 */
@Component({
  selector: 'app-reports-fatigue-bars',
  standalone: true,
  imports: [MatIconButton, MatIcon, TranslatePipe],
  templateUrl: './reports-fatigue-bars.html',
  styleUrl: './reports-fatigue-bars.css',
})
export class ReportsFatigueBars {
  private readonly barsSignal = signal<AnalyticsFatigueBar[]>([]);

  @Input({ required: true }) set bars(value: AnalyticsFatigueBar[]) {
    this.barsSignal.set(value);
  }

  /**
   * Maximum fatigueEvents across the dataset, used to scale bar widths
   * proportionally when the API does not pre-compute a width hint.
   */
  readonly maxFatigueEvents = computed(() => {
    const all = this.barsSignal();
    if (!all.length) return 1;
    return Math.max(1, ...all.map((bar) => bar.fatigueEvents));
  });

  readonly visibleBars = this.barsSignal.asReadonly();

  widthFor(events: number): number {
    return Math.round((events / this.maxFatigueEvents()) * 100);
  }
}
