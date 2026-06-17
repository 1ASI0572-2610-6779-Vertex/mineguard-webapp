import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { ServiceDesignStore } from '../../../application/service-design.store';
import { MonitoringStore } from '../../../../monitoring/application/monitoring.store';
import { LiveMap } from '../../../../monitoring/presentation/components/live-map/live-map';
import { RouteCard } from '../../component/route-card/route-card.component';
import { ShiftCard } from '../../component/shift-card/shift-card.component';

@Component({
  selector: 'app-service-design-page',
  standalone: true,
  providers: [ServiceDesignStore],
  imports: [
    RouterOutlet, RouterLink,
    MatButtonModule, MatIconModule, MatTabsModule, MatSnackBarModule,
    TranslatePipe,
    LiveMap, RouteCard, ShiftCard,
  ],
  templateUrl: './service-design-page.component.html',
  styleUrl: './service-design-page.component.css',
})
export class ServiceDesignPage implements OnInit {
  protected store   = inject(ServiceDesignStore);
  private monitoring = inject(MonitoringStore);
  private router    = inject(Router);
  private snackBar  = inject(MatSnackBar);

  readonly vehicles      = this.monitoring.liveMapVehicles;
  readonly routeOverlays = this.monitoring.routeOverlays;

  ngOnInit(): void {
    this.store.loadRoutes();
    this.monitoring.loadLiveMapVehicles();
    this.monitoring.loadRoutes();
  }

  onSelectRoute(id: string): void {
    this.store.selectRoute(id);
  }

  onEditRoute(id: string): void {
    this.router.navigate(['/service/planning', id, 'edit']);
  }

  onViewOnMap(id: string): void {
    this.store.selectRoute(id);
    this.snackBar.open('Ruta resaltada en el mapa', 'OK', {
      duration: 2500,
      panelClass: ['mg-snack', 'mg-snack--neutral'],
    });
  }

  onAssignVehicle(id: string): void {
    this.snackBar.open('Asignación de vehículo próximamente disponible', 'OK', {
      duration: 3000,
      panelClass: ['mg-snack', 'mg-snack--neutral'],
    });
  }
}
