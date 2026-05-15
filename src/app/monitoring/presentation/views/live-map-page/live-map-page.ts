import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

import { MonitoringStore } from '../../../application/monitoring.store';
import { AlertsSummaryCard } from '../../components/alerts-summary-card/alerts-summary-card';
import { CardiacMonitorCard } from '../../components/cardiac-monitor-card/cardiac-monitor-card';
import { FleetSummaryCard } from '../../components/fleet-summary-card/fleet-summary-card';
import { LiveMap } from '../../components/live-map/live-map';

/**
 * Supervisor "Mapa Operativo en Vivo" view ({@link supervisor2.png} wireframe).
 *
 * @remarks
 * Composes the Leaflet live map on the left and four sidebar widgets on the
 * right: fleet status counters, critical-alerts summary, cardiac monitor and
 * a CTA button to the incident report.
 */
@Component({
  selector: 'app-live-map-page',
  standalone: true,
  imports: [
    LiveMap,
    FleetSummaryCard,
    AlertsSummaryCard,
    CardiacMonitorCard,
    MatButton,
    TranslatePipe,
  ],
  templateUrl: './live-map-page.html',
  styleUrl: './live-map-page.css',
})
export class LiveMapPage implements OnInit {
  private store = inject(MonitoringStore);

  readonly vehicles = this.store.liveMapVehicles;
  readonly fleetSummary = this.store.fleetSummary;
  readonly criticalAlerts = this.store.criticalActiveAlerts;
  readonly cardiacReadings = this.store.cardiacReadings;

  readonly searchQuery = '';

  ngOnInit(): void {
    this.store.loadLiveMapVehicles();
    this.store.loadFleetSummary();
    this.store.loadCardiacReadings();
    this.store.loadAlerts();
  }
}
