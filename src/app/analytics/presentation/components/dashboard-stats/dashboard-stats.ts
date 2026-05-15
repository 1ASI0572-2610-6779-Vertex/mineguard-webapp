import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardSummary } from '../../../domain/model/dashboard-summary.entity';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.css',
})
export class DashboardStats {
  @Input({ required: true }) summary!: DashboardSummary;
}
