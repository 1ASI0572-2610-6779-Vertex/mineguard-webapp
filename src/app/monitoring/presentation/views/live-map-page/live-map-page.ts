import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../../assets/application/assets.store';
import { MonitoringStore } from '../../../application/monitoring.store';
import { LiveMap } from '../../components/live-map/live-map';

/**
 * A vehicle row in the "Unidades en campo" panel.
 *
 * @remarks
 * The fleet roster (`GET /vehicles`) and the GPS snapshot
 * (`GET /vehicles/positions`) are separate resources: a vehicle only appears in
 * the latter once its device has reported a fix. Joining them lets the panel
 * list the whole operational fleet while still marking which units are actually
 * locatable on the map.
 */
export interface FieldUnit {
  id: number;
  code: string;
  vehicleType: string;
  driverName: string;
  /** True when the vehicle has a GPS fix and therefore a marker on the map. */
  isTracked: boolean;
  /** Live-map id of the tracked marker, used to sync hover highlighting. */
  markerId: number | null;
}

@Component({
  selector: 'app-live-map-page',
  standalone: true,
  imports: [LiveMap, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './live-map-page.html',
  styleUrl: './live-map-page.css',
})
export class LiveMapPage implements OnInit, OnDestroy {
  private monitoring = inject(MonitoringStore);
  private assets     = inject(AssetsStore);
  private router     = inject(Router);

  readonly positions      = this.monitoring.liveMapVehicles;
  readonly fleetSummary   = this.monitoring.fleetSummary;
  readonly criticalAlerts = this.monitoring.criticalActiveAlerts;

  private readonly fleet = this.assets.vehicles;

  readonly hoveredVehicleId = signal<number | null>(null);

  /**
   * Operational fleet, annotated with whether each unit is currently tracked.
   * Positions are matched by `code` — the key the backend itself uses to scope
   * `/vehicles/positions` to the tenant (that resource carries no `companyId`).
   */
  readonly fieldUnits = computed<FieldUnit[]>(() => {
    const positionsByCode = new Map(this.positions().map((v) => [v.code, v]));

    return this.fleet()
      .filter((vehicle) => vehicle.status === 'operational')
      .map((vehicle) => {
        const tracked = positionsByCode.get(vehicle.code);
        return {
          id: vehicle.id,
          code: vehicle.code,
          vehicleType: vehicle.category,
          driverName: tracked?.driverName || vehicle.assignedDriverName || '',
          isTracked: tracked != null,
          markerId: tracked?.id ?? null,
        };
      });
  });

  readonly trackedCount = computed(() => this.fieldUnits().filter((u) => u.isTracked).length);

  readonly isLoading = computed(() => this.fleet().length === 0 && !this.fleetSummary());

  readonly lastUpdated = computed(() => {
    const now = new Date();
    return now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  ngOnInit(): void {
    this.monitoring.startLiveMapPolling();
    this.monitoring.loadFleetSummary();
    this.monitoring.loadAlerts();
    this.assets.loadVehicles();
  }

  ngOnDestroy(): void {
    this.monitoring.stopLiveMapPolling();
  }

  /** Only tracked units have a marker to highlight. */
  onUnitHover(unit: FieldUnit | null): void {
    this.hoveredVehicleId.set(unit?.markerId ?? null);
  }

  vehicleTypeIcon(vehicleType: string): string {
    const type = vehicleType.toLowerCase();
    if (type.includes('camión') || type.includes('camion')) return 'local_shipping';
    if (type.includes('excavadora')) return 'agriculture';
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
    this.router.navigate(['/alerts']);
  }
}
