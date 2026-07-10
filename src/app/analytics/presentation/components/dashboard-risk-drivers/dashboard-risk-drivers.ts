import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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
  @Output() readonly driverSelected = new EventEmitter<number>();

  private router = inject(Router);

  /**
   * Bar width relative to the highest-scoring driver on screen.
   *
   * @remarks
   * `riskScore` is an unbounded cumulative penalty (20 points per critical
   * alert), not a percentage — it routinely exceeds 100 on a bad shift. Scaling
   * against a fixed 100 ceiling pinned the whole ranking at full width and
   * erased the very comparison the widget exists to make, so the leader defines
   * the scale and everyone else reads as a fraction of them.
   */
  barWidth(score: number): string {
    const leader = Math.max(...this.riskDrivers.map((d) => d.riskScore), 0);
    if (leader <= 0) return '0%';
    return `${(score / leader) * 100}%`;
  }

  /**
   * Severity tint by share of the leader's score, not by absolute points: 70
   * points means something different in a fleet topping out at 80 than in one
   * topping out at 400.
   */
  severityOf(score: number): 'high' | 'medium' | 'low' {
    const leader = Math.max(...this.riskDrivers.map((d) => d.riskScore), 0);
    if (leader <= 0) return 'low';
    const share = score / leader;
    if (share >= 0.7) return 'high';
    if (share >= 0.4) return 'medium';
    return 'low';
  }

  selectDriver(driver: DashboardRiskDriver): void {
    this.driverSelected.emit(driver.driverId);
  }

  /** Navigates to the reports page to view the full driver risk report. */
  goToFullReport(): void {
    this.router.navigate(['/reports']);
  }
}
