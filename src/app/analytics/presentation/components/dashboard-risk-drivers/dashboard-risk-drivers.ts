import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { DashboardRiskDriver } from '../../../domain/model/dashboard-risk-driver.entity';

/**
 * Drivers-at-risk ranking widget for the control-center dashboard.
 */
@Component({
  selector: 'app-dashboard-risk-drivers',
  standalone: true,
  imports: [DecimalPipe, TranslatePipe],
  templateUrl: './dashboard-risk-drivers.html',
  styleUrl: './dashboard-risk-drivers.css',
})
export class DashboardRiskDrivers {
  @Input({ required: true }) riskDrivers: DashboardRiskDriver[] = [];
}
