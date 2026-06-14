import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

import { ServiceDesignStore } from '../../../application/service-design.store';
import { MonitoringStore } from '../../../../monitoring/application/monitoring.store';
import { LiveMap } from '../../../../monitoring/presentation/components/live-map/live-map';
import { RouteCard } from '../../component/route-card/route-card.component';
import { ShiftCard } from '../../component/shift-card/shift-card.component';


@Component({
  selector: 'app-service-design-page',
  standalone: true,
  providers:[
    ServiceDesignStore
  ],
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    TranslatePipe,
    LiveMap,
    RouteCard,
    ShiftCard,
  ],
  templateUrl: './service-design-page.component.html',
  styleUrl: './service-design-page.component.css',
})
export class ServiceDesignPage implements OnInit {
  protected store = inject(ServiceDesignStore);
  private monitoringStore = inject(MonitoringStore);

  readonly vehicles = this.monitoringStore.liveMapVehicles;

  ngOnInit(): void {
    this.store.loadRoutes();
    this.monitoringStore.loadLiveMapVehicles();
  }
}
