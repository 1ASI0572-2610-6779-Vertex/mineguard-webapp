import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { DriversDirectory } from '../../components/drivers-directory/drivers-directory';
import { VehiclesInventory } from '../../components/vehicles-inventory/vehicles-inventory';

type FleetTab = 'vehicles' | 'drivers';

/**
 * Supervisor "Flota y Conductores" view.
 *
 * @remarks
 * Composite page with two internal tabs ({@link supervisor4_1.png} and
 * {@link supervisor4_2.png} wireframes). The tab state is local to this
 * component; both tabs share the same route URL.
 */
@Component({
  selector: 'app-fleet-and-drivers-page',
  standalone: true,
  imports: [MatButton, MatIcon, VehiclesInventory, DriversDirectory, TranslatePipe],
  templateUrl: './fleet-and-drivers-page.html',
  styleUrl: './fleet-and-drivers-page.css',
})
export class FleetAndDriversPage implements OnInit {
  private store = inject(AssetsStore);

  readonly activeTab = signal<FleetTab>('vehicles');
  readonly vehicles = this.store.vehicles;
  readonly drivers = this.store.drivers;

  ngOnInit(): void {
    this.store.loadVehicles();
    this.store.loadDrivers();
  }

  selectTab(tab: FleetTab): void {
    this.activeTab.set(tab);
  }
}
