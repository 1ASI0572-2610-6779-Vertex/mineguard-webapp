import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardRiskDriver } from '../../model/analytics.entity';

@Component({
  selector: 'app-dashboard-risk-drivers',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-risk-drivers.component.html',
  styleUrl: './dashboard-risk-drivers.component.css',
})
export class DashboardRiskDriversComponent {
  @Input({ required: true }) riskDrivers: DashboardRiskDriver[] = [];
}
