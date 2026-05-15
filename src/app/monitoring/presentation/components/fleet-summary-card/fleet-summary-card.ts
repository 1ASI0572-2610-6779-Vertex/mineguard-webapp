import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FleetSummary } from '../../../domain/model/fleet-summary.entity';

/**
 * "Estado General de la Flota" sidebar widget for the live-map view.
 */
@Component({
  selector: 'app-fleet-summary-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './fleet-summary-card.html',
  styleUrl: './fleet-summary-card.css',
})
export class FleetSummaryCard {
  @Input({ required: true }) summary!: FleetSummary;
}
