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

export interface RouteOverlay {
  id: string;
  name: string;
  coords: [number, number][];
  status: string;
}

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './live-map.html',
  styleUrl: './live-map.css',
})
export class LiveMap implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private readonly vehiclesSignal     = signal<LiveMapVehicle[]>([]);
  private readonly routeOverlaysSignal = signal<RouteOverlay[]>([]);

  private map: L.Map | null = null;
  private markers: L.CircleMarker[] = [];
  private routeLines: L.Polyline[]  = [];
  private resizeObserver: ResizeObserver | null = null;
  private routePolygons: L.Polygon[] = [];

  @Input({ required: true }) set vehicles(value: LiveMapVehicle[]) {
    this.vehiclesSignal.set(value);
  }

  @Input() set routeOverlays(value: RouteOverlay[]) {
    this.routeOverlaysSignal.set(value ?? []);
  }

  get activeRoutesCount(): number {
    return this.vehiclesSignal().filter((v) => v.status === 'operational').length;
  }

  constructor() {
    effect(() => {
      const vehicles = this.vehiclesSignal();
      if (this.map) this.renderMarkers(vehicles);
    });

    effect(() => {
      const overlays = this.routeOverlaysSignal();
      if (this.map) this.renderRouteOverlays(overlays);
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

    // Render inicial
    this.renderRouteOverlays(this.routeOverlaysSignal());
    this.renderMarkers(this.vehiclesSignal());

    setTimeout(() => this.map?.invalidateSize(), 0);

    this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers    = [];
    this.routeLines = [];
  }

  private renderMarkers(vehicles: LiveMapVehicle[]): void {
    if (!this.map) return;

    this.markers.forEach((m) => m.remove());
    this.markers = [];

    if (!vehicles.length) return;

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

  private renderRouteOverlays(overlays: RouteOverlay[]): void {
    if (!this.map) return;

    // Limpiar anteriores
    this.routeLines.forEach(l => l.remove());
    this.routeLines = [];
    this.routePolygons.forEach(p => p.remove());   // ← nuevo
    this.routePolygons = [];                        // ← nuevo

    overlays.forEach((route) => {
      if (route.coords.length < 2) return;

      const isActive  = route.status === 'active';
      const color     = isActive ? '#00c2b2' : '#3b82f6';
      const dashArray = isActive ? undefined : '8 5';

      // ── Polígono relleno (mancha) ──────────────────────────────
      if (route.coords.length >= 3) {
        const polygon = L.polygon(route.coords, {
          color,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.18,        // mancha translúcida
          dashArray,
        }).bindTooltip(route.name, { sticky: true });

        polygon.addTo(this.map!);
        this.routePolygons.push(polygon);
      }

      // ── Línea de ruta encima ───────────────────────────────────
      const line = L.polyline(route.coords, {
        color,
        weight: 3,
        dashArray,
        opacity: 0.9,
      }).bindTooltip(route.name, { sticky: true });

      line.addTo(this.map!);
      this.routeLines.push(line);

      // ── Waypoint markers ──────────────────────────────────────
      route.coords.forEach((coord, i) => {
        const isFirst = i === 0;
        const isLast  = i === route.coords.length - 1;

        L.circleMarker(coord, {
          radius: isFirst || isLast ? 7 : 5,
          weight: 2,
          color: '#ffffff',
          fillColor: color,
          fillOpacity: 1,
        })
          .bindTooltip(`${route.name} – punto ${i + 1}`, { direction: 'top' })
          .addTo(this.map!);
      });
    });
  }

  private colorFor(status: VehicleOperationalStatus): string {
    switch (status) {
      case 'operational': return '#16a34a';
      case 'maintenance': return '#f59e0b';
      case 'alert':       return '#dc2626';
    }
  }
}
