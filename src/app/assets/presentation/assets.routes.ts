import { Routes } from '@angular/router';

import { roleGuard } from '../../iam/infrastructure/role.guard';

const fleetAndDriversPage = () =>
  import('./views/fleet-and-drivers-page/fleet-and-drivers-page').then(
    (m) => m.FleetAndDriversPage,
  );

/**
 * Route tree for the assets bounded context.
 *
 * @remarks
 * `/fleet-and-drivers` exposes the supervisor view that combines the
 * "Inventario de Vehículos" and "Directorio de Conductores" tabs in a single
 * page. The catalog-summary widget is consumed cross-BC by the monitoring
 * `audit-and-assets` admin view and does not have its own route here.
 */
export const assetsRoutes: Routes = [
  {
    path: 'fleet-and-drivers',
    loadComponent: fleetAndDriversPage,
    canActivate: [roleGuard(['Supervisor'])],
  },
];
