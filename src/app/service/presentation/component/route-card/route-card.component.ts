import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { Route } from '../../../domain/model/route.entity';
import { RouteStatus } from '../../../domain/model/route-status';

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.css',
})
export class RouteCard {
  @Input({ required: true }) route!: Route;
  @Input() selected = false;

  @Output() readonly select         = new EventEmitter<string>();
  @Output() readonly statusChange   = new EventEmitter<{ id: string; status: RouteStatus }>();
  @Output() readonly delete         = new EventEmitter<string>();
  @Output() readonly editRoute      = new EventEmitter<string>();
  @Output() readonly viewOnMap      = new EventEmitter<string>();
  @Output() readonly assignVehicle  = new EventEmitter<string>();

  get statusLabel(): string {
    switch (this.route.status) {
      case 'active':    return 'Activa';
      case 'planned':   return 'Planificada';
      case 'suspended': return 'Suspendida';
      case 'completed': return 'Completada';
    }
  }

  get shiftIcon(): string {
    switch (this.route.shift?.type) {
      case 'morning':   return 'wb_sunny';
      case 'afternoon': return 'wb_twilight';
      case 'night':     return 'bedtime';
      default:          return 'schedule';
    }
  }

  get previewWaypoints(): string[] {
    return this.route.waypoints
      .slice(0, 3)
      .map((w) => w.label || `Punto ${w.order}`);
  }

  get hasMoreWaypoints(): boolean {
    return this.route.waypoints.length > 3;
  }
}
