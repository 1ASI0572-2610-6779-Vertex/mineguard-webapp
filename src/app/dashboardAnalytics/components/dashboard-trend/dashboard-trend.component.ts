import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardTrend } from '../../model/analytics.entity';

@Component({
  selector: 'app-dashboard-trend',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-trend.component.html',
  styleUrl: './dashboard-trend.component.css',
})
export class DashboardTrendComponent {
  @Input({ required: true }) trend: DashboardTrend[] = [];
  @Input({ required: true }) alertTrendPath = '';
  @Input({ required: true }) incidentTrendPath = '';
}
