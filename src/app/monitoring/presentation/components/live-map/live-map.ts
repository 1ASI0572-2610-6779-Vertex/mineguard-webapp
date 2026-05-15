import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import * as L from 'leaflet';

import { LiveMapVehicle } from '../../../domain/model/live-map-vehicle.entity';
import { VehicleOperationalStatus } from '../../../domain/model/vehicle-operational-status';

/**
 * Leaflet-backed live map showing every active vehicle as a colored circle
 * marker positioned by lat/lng. Used by the supervisor "Mapa Operativo en
 * Vivo" view.
 *
 * @remarks
 * Tiles come from OpenStreetMap. Marker color is driven by the vehicle's
 * operational status (green / orange / red). A small overlay shows the
 * count of active vehicle routes.
 */
@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './live-map.html',
  styleUrl: './live-map.css',
})
export class LiveMap implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private readonly vehiclesSignal = signal<LiveMapVehicle[]>([]);
  private map: L.Map | null = null;
  private markers: L.CircleMarker[] = [];
  private resizeObserver: ResizeObserver | null = null;

  @Input({ required: true }) set vehicles(value: LiveMapVehicle[]) {
    this.vehiclesSignal.set(value);
  }

  get activeRoutesCount(): number {
    return this.vehiclesSignal().filter((v) => v.status === 'operational').length;
  }

  constructor() {
    effect(() => {
      const vehicles = this.vehiclesSignal();
      if (this.map) {
        this.renderMarkers(vehicles);
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [-16.409, -71.537],
      zoom: 14,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.renderMarkers(this.vehiclesSignal());

    /**
     * Force a tile re-render once the container has settled into its final
     * dimensions. Without this Leaflet stops short and only paints a subset
     * of tiles (the well-known "white gaps" artifact).
     */
    setTimeout(() => this.map?.invalidateSize(), 0);

    /**
     * React to any subsequent container resize — window resize, sidenav
     * collapse, language toggle that shifts toolbar height, etc. — by
     * invalidating size so tiles are repainted to fill the new viewport.
     */
    this.resizeObserver = new ResizeObserver(() => {
      this.map?.invalidateSize();
    });
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }

  private renderMarkers(vehicles: LiveMapVehicle[]): void {
    if (!this.map) return;

    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    if (vehicles.length === 0) return;

    vehicles.forEach((vehicle) => {
      const marker = L.circleMarker([vehicle.latitude, vehicle.longitude], {
        radius: 9,
        weight: 3,
        color: '#ffffff',
        fillColor: this.colorFor(vehicle.status),
        fillOpacity: 0.95,
      });
      marker.bindTooltip(
        `<strong>${vehicle.code}</strong><br>${vehicle.vehicleType}<br>${vehicle.driverName}`,
        { direction: 'top', offset: [0, -8] },
      );
      marker.addTo(this.map!);
      this.markers.push(marker);
    });

    const bounds = L.latLngBounds(vehicles.map((v) => [v.latitude, v.longitude]));
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }

  private colorFor(status: VehicleOperationalStatus): string {
    switch (status) {
      case 'operational':
        return '#16a34a';
      case 'maintenance':
        return '#f59e0b';
      case 'alert':
        return '#dc2626';
    }
  }
}
