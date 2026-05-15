import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardRiskDriver } from '../../../domain/model/dashboard-risk-driver.entity';

@Component({
  selector: 'app-dashboard-risk-drivers',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-risk-drivers.html',
  styleUrl: './dashboard-risk-drivers.css',
})
export class DashboardRiskDrivers {
  @Input({ required: true }) riskDrivers: DashboardRiskDriver[] = [];
}
