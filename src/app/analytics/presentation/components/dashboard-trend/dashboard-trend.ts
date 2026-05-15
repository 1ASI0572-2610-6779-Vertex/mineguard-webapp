import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardTrend as DashboardTrendEntity } from '../../../domain/model/dashboard-trend.entity';

/**
 * Incident-trend mini chart for the control-center dashboard.
 */
@Component({
  selector: 'app-dashboard-trend',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './dashboard-trend.html',
  styleUrl: './dashboard-trend.css',
})
export class DashboardTrend {
  @Input({ required: true }) trend: DashboardTrendEntity[] = [];
  @Input({ required: true }) alertTrendPath = '';
  @Input({ required: true }) incidentTrendPath = '';
}
