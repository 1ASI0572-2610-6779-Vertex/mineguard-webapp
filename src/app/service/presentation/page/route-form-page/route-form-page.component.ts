import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ServiceDesignStore } from '../../../application/service-design.store';
import { RouteWaypoint } from '../../../domain/model/route-waypoint.value-object';

interface WaypointForm {
  label: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-route-form-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './route-form-page.component.html',
  styleUrl: './route-form-page.component.css',
})
export class RouteFormPage {
  protected store = inject(ServiceDesignStore);
  private router = inject(Router);

  form = {
    name: '',
    shiftId: '',
    assignedVehicleIds: [] as string[],
    waypoints: [
      { label: '', latitude: -16.409, longitude: -71.537 },
    ] as WaypointForm[],
  };

  isValid(): boolean {
    return (
      this.form.name.trim().length > 0 &&
      this.form.shiftId.length > 0 &&
      this.form.waypoints.length >= 2 &&
      this.form.waypoints.every((w) => w.label.trim().length > 0)
    );
  }

  addWaypoint(): void {
    this.form.waypoints.push({ label: '', latitude: -16.409, longitude: -71.537 });
  }

  removeWaypoint(index: number): void {
    this.form.waypoints.splice(index, 1);
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
