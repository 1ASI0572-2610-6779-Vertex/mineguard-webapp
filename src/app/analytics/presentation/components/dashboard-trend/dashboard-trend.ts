import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardTrend as DashboardTrendEntity } from '../../../domain/model/dashboard-trend.entity';

@Component({
  selector: 'app-dashboard-trend',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-trend.html',
  styleUrl: './dashboard-trend.css',
})
export class DashboardTrend {
  @Input({ required: true }) trend: DashboardTrendEntity[] = [];
  @Input({ required: true }) alertTrendPath = '';
  @Input({ required: true }) incidentTrendPath = '';
}
