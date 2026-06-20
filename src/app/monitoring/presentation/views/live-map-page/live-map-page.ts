import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { MonitoringStore } from '../../../application/monitoring.store';
import { LiveMap } from '../../components/live-map/live-map';

@Component({
  selector: 'app-live-map-page',
  standalone: true,
  imports: [LiveMap, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './live-map-page.html',
  styleUrl: './live-map-page.css',
})
export class LiveMapPage implements OnInit, OnDestroy {
  private store  = inject(MonitoringStore);
  private router = inject(Router);

  readonly vehicles       = this.store.liveMapVehicles;
  readonly fleetSummary   = this.store.fleetSummary;
  readonly criticalAlerts = this.store.criticalActiveAlerts;
  readonly cardiacReadings = this.store.cardiacReadings;
  readonly routeOverlays  = this.store.routeOverlays;

  readonly hoveredVehicleId = signal<number | null>(null);
  readonly selectedTripId   = signal<number | null>(null);

  readonly isLoading = computed(
    () => this.vehicles().length === 0 && !this.fleetSummary(),
  );

  readonly operationalCount = computed(
    () => this.vehicles().filter((v) => v.status === 'in_transit').length,
  );
  readonly maintenanceCount = computed(
    () => this.vehicles().filter((v) => v.status === 'maintenance').length,
  );
  readonly alertVehicleCount = computed(
    () => this.vehicles().filter((v) => v.status === 'alert').length,
  );

  readonly lastUpdated = computed(() => {
    const now = new Date();
    return now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  ngOnInit(): void {
    this.store.startLiveMapPolling();
    this.store.loadFleetSummary();
    this.store.loadAlerts();
    this.store.loadRoutes();
  }

  selectVehicle(activeTripId: number | null): void {
    if (activeTripId == null) return;
    this.selectedTripId.set(activeTripId);
    this.store.loadCardiacReadings(activeTripId);
  }

  ngOnDestroy(): void {
    this.store.stopLiveMapPolling();
  }

  vehicleTypeIcon(vehicleType: string): string {
    if (vehicleType.toLowerCase().includes('camión')) return 'local_shipping';
    if (vehicleType.toLowerCase().includes('excavadora')) return 'agriculture';
    return 'directions_car';
  }

  alertTypeIcon(type: string): string {
    if (type === 'fatigue_risk') return 'bedtime';
    if (type === 'high_heart_rate') return 'favorite';
    if (type === 'restricted_zone_entry') return 'do_not_enter';
    if (type === 'connection_lost') return 'signal_wifi_off';
    return 'car_crash'; // proximity_collision
  }

  goToAlerts(): void {
    this.router.navigate(['/monitoring/alerts']);
  }
}
