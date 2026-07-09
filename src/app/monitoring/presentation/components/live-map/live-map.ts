import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import * as L from 'leaflet';

import { LiveMapVehicle } from '../../../domain/model/live-map-vehicle.entity';
import { VehicleOperationalStatus } from '../../../domain/model/vehicle-operational-status';

const VEHICLE_COLORS: Record<VehicleOperationalStatus, string> = {
  in_transit:  '#16a34a',
  maintenance: '#f59e0b',
  alert:       '#dc2626',
};

/**
 * Where the map opens before any vehicle has reported a GPS fix.
 * Once `GET /vehicles/positions` returns markers, `fitBounds` overrides this.
 */
const DEFAULT_CENTER: L.LatLngTuple = [-9.54728918743845, -77.05224329616134];
const DEFAULT_ZOOM = 15;

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [],
  templateUrl: './live-map.html',
  styleUrl: './live-map.css',
})
export class LiveMap implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private readonly vehiclesSignal  = signal<LiveMapVehicle[]>([]);
  private readonly hoveredIdSignal = signal<number | null>(null);

  private map: L.Map | null = null;
  private readonly markerMap = new Map<number, L.Marker>();
  private resizeObserver: ResizeObserver | null = null;

  @Input({ required: true }) set vehicles(value: LiveMapVehicle[]) {
    this.vehiclesSignal.set(value);
  }

  @Input() set hoveredVehicleId(id: number | null) {
    this.hoveredIdSignal.set(id ?? null);
  }

  @Output() readonly vehicleHover = new EventEmitter<number | null>();

  get operationalCount(): number {
    return this.vehiclesSignal().filter((v) => v.status === 'in_transit').length;
  }

  get alertCount(): number {
    return this.vehiclesSignal().filter((v) => v.status === 'alert').length;
  }

  get totalCount(): number {
    return this.vehiclesSignal().length;
  }

  constructor() {
    effect(() => {
      const vehicles = this.vehiclesSignal();
      if (this.map) this.renderMarkers(vehicles);
    });

    effect(() => {
      const id = this.hoveredIdSignal();
      this.updateMarkerHighlight(id);
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

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
    this.markerMap.clear();
  }

  private createVehicleIcon(status: VehicleOperationalStatus): L.DivIcon {
    const color   = VEHICLE_COLORS[status];
    const isPulse = status === 'alert';
    return L.divIcon({
      className: '',
      html: `<div class="mg-vm mg-vm--${status}">
               ${isPulse ? '<div class="mg-vm-ring"></div>' : ''}
               <div class="mg-vm-core" style="background:${color}"></div>
             </div>`,
      iconSize:   [24, 24],
      iconAnchor: [12, 12],
    });
  }

  private renderMarkers(vehicles: LiveMapVehicle[]): void {
    if (!this.map) return;

    this.markerMap.forEach((m) => m.remove());
    this.markerMap.clear();

    if (!vehicles.length) return;

    vehicles.forEach((vehicle) => {
      const marker = L.marker([vehicle.latitude, vehicle.longitude], {
        icon: this.createVehicleIcon(vehicle.status),
        zIndexOffset: vehicle.status === 'alert' ? 1000 : 0,
      });

      marker.bindTooltip(
        `<strong>${vehicle.code}</strong><br>${vehicle.vehicleType}<br>${vehicle.driverName}`,
        { direction: 'top', offset: [0, -10] },
      );

      marker.on('mouseover', () => this.vehicleHover.emit(vehicle.id));
      marker.on('mouseout',  () => this.vehicleHover.emit(null));

      marker.addTo(this.map!);
      this.markerMap.set(vehicle.id, marker);
    });

    const bounds = L.latLngBounds(vehicles.map((v) => [v.latitude, v.longitude]));
    if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }

  private updateMarkerHighlight(id: number | null): void {
    this.markerMap.forEach((marker, vehicleId) => {
      const el = marker.getElement();
      if (!el) return;
      const core = el.querySelector<HTMLElement>('.mg-vm-core');
      if (!core) return;
      if (vehicleId === id) {
        core.style.width  = '18px';
        core.style.height = '18px';
        core.style.top    = '3px';
        core.style.left   = '3px';
        core.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.6), 0 3px 8px rgba(0,0,0,0.4)';
      } else {
        core.style.width  = '14px';
        core.style.height = '14px';
        core.style.top    = '5px';
        core.style.left   = '5px';
        core.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      }
    });
  }

}
