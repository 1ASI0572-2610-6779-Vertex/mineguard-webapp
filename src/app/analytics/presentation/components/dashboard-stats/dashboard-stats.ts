import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardSummary } from '../../../domain/model/dashboard-summary.entity';

/**
 * KPI strip for the control-center dashboard.
 */
@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.css',
})
export class DashboardStats {
  @Input({ required: true }) summary!: DashboardSummary;
}
