import {
  Component, inject, OnInit, OnDestroy,
  AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import * as L from 'leaflet';
import { ServiceDesignStore } from '../../../application/service-design.store';
import { RouteWaypoint } from '../../../domain/model/route-waypoint.value-object';

interface WaypointForm {
  label: string;
  latitude: number;
  longitude: number;
  marker?: L.Marker;
}

@Component({
  selector: 'app-route-form-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './route-form-page.component.html',
  styleUrl: './route-form-page.component.css',
})
export class RouteFormPage implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  protected store = inject(ServiceDesignStore);
  private router = inject(Router);

  private map!: L.Map;
  private polyline!: L.Polyline;

  // Arequipa por defecto — ajusta según tu contexto
  private readonly DEFAULT_CENTER: L.LatLngTuple = [-16.409, -71.537];
  private readonly DEFAULT_ZOOM = 14;

  form = {
    name: '',
    shiftId: '',
    assignedVehicleIds: [] as string[],
    waypoints: [] as WaypointForm[],
  };

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  // ─── Map ────────────────────────────────────────────────────────────────────

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.DEFAULT_CENTER,
      zoom: this.DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(this.map);

    this.polyline = L.polyline([], {
      color: '#1D9E75',
      weight: 3,
      dashArray: '8, 5',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const { lat, lng } = e.latlng;
    const index = this.form.waypoints.length;

    const marker = this.createMarker(lat, lng, index);

    this.form.waypoints.push({
      label: '',
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      marker,
    });

    this.refreshPolyline();
  }

  private createMarker(lat: number, lng: number, index: number): L.Marker {
    const icon = L.divIcon({
      className: '',
      html: `<div class="custom-marker">
               <div class="marker-num">${index + 1}</div>
             </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    return L.marker([lat, lng], { icon, draggable: true })
      .addTo(this.map)
      .on('drag', (e: L.LeafletEvent) => {
        const m = e.target as L.Marker;
        const pos = m.getLatLng();
        const wp = this.form.waypoints[index];
        if (wp) {
          wp.latitude  = parseFloat(pos.lat.toFixed(6));
          wp.longitude = parseFloat(pos.lng.toFixed(6));
          this.refreshPolyline();
        }
      });
  }

  private refreshPolyline(): void {
    const coords = this.form.waypoints.map(
      wp => [wp.latitude, wp.longitude] as L.LatLngTuple
    );
    this.polyline.setLatLngs(coords);
  }

  private refreshMarkerNumbers(): void {
    this.form.waypoints.forEach((wp, i) => {
      wp.marker?.setIcon(
        L.divIcon({
          className: '',
          html: `<div class="custom-marker">
                   <div class="marker-num">${i + 1}</div>
                 </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      );
    });
  }

  // ─── Waypoints ──────────────────────────────────────────────────────────────

  removeWaypoint(index: number): void {
    const wp = this.form.waypoints[index];
    wp.marker?.remove();
    this.form.waypoints.splice(index, 1);
    this.refreshPolyline();
    this.refreshMarkerNumbers();
  }

  // ─── Form ───────────────────────────────────────────────────────────────────

  isValid(): boolean {
    return (
      this.form.name.trim().length > 0 &&
      this.form.shiftId.length > 0 &&
      this.form.waypoints.length >= 2 &&
      this.form.waypoints.every(w => w.label.trim().length > 0)
    );
  }

  async save(): Promise<void> {
    if (!this.isValid()) return;

    const waypoints = this.form.waypoints.map(
      (w, i) => new RouteWaypoint(w.latitude, w.longitude, w.label, i + 1)
    );

    await this.store.createRoute({
      name: this.form.name,
      shiftId: this.form.shiftId,
      assignedVehicleIds: this.form.assignedVehicleIds,
      waypoints,
    });

    this.close();
  }

  close(): void {
    this.router.navigate(['/service/planning']);
  }
}
