import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdminSummary } from '../../../domain/model/admin-summary.entity';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css',
})
export class AdminStats {
  @Input({ required: true }) summary!: AdminSummary;

  private router = inject(Router);

  get sensorHealthPct(): number {
    if (!this.summary.totalSensors) return 0;
    return Math.round((this.summary.activeSensors / this.summary.totalSensors) * 100);
  }

  goToUsers(): void {
    this.router.navigate(['/iam/supervisors']);
  }
}
