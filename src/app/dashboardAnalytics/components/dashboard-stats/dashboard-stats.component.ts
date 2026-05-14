import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardSummary } from '../../model/analytics.entity';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.css',
})
export class DashboardStatsComponent {
  @Input({ required: true }) summary!: DashboardSummary;
}
