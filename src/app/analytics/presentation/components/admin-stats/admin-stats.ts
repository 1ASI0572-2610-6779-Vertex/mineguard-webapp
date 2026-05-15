import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AdminSummary } from '../../../domain/model/admin-summary.entity';

/**
 * KPI strip for the admin control panel: hardware health, locked accounts and
 * total registered assets.
 */
@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [MatIcon, TranslatePipe],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css',
})
export class AdminStats {
  @Input({ required: true }) summary!: AdminSummary;
}
