import { DecimalPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardRiskDriver } from '../../../domain/model/dashboard-risk-driver.entity';

/**
 * Drivers-at-risk ranking widget for the control-center dashboard.
 */
@Component({
  selector: 'app-dashboard-risk-drivers',
  standalone: true,
  imports: [DecimalPipe, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './dashboard-risk-drivers.html',
  styleUrl: './dashboard-risk-drivers.css',
})
export class DashboardRiskDrivers {
  @Input({ required: true }) riskDrivers: DashboardRiskDriver[] = [];

  private router = inject(Router);

  /** Risk bar width as percentage of max score (100). */
  barWidth(score: number): string {
    return `${Math.min(score, 100)}%`;
  }

  /** Navigates to the reports page to view the full driver risk report. */
  goToFullReport(): void {
    this.router.navigate(['/analytics/reports']);
  }
}
