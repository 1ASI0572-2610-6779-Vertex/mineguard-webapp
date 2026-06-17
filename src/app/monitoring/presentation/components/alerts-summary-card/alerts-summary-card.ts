import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

import { Alert } from '../../../domain/model/alert.entity';

@Component({
  selector: 'app-alerts-summary-card',
  standalone: true,
  imports: [TranslatePipe, MatIconModule],
  templateUrl: './alerts-summary-card.html',
  styleUrl: './alerts-summary-card.css',
})
export class AlertsSummaryCard {
  @Input({ required: true }) alerts: Alert[] = [];

  elapsedFor(isoTimestamp: string): { value: number; unit: 'minutes' | 'hours' | 'days' } {
    const occurred = new Date(isoTimestamp).getTime();
    const now = Date.now();
    if (Number.isNaN(occurred)) return { value: 0, unit: 'minutes' };
    const diffMs = Math.max(0, now - occurred);
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return { value: minutes, unit: 'minutes' };
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return { value: hours, unit: 'hours' };
    return { value: Math.floor(hours / 24), unit: 'days' };
  }
}