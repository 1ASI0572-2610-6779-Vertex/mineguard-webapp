import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CardiacReading } from '../../../domain/model/cardiac-reading.entity';

/**
 * "Monitoreo Cardiaco" sidebar widget for the live-map view.
 */
@Component({
  selector: 'app-cardiac-monitor-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './cardiac-monitor-card.html',
  styleUrl: './cardiac-monitor-card.css',
})
export class CardiacMonitorCard {
  @Input({ required: true }) readings: CardiacReading[] = [];
}
