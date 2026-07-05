import { Routes } from '@angular/router';

import { roleGuard } from '../../iam/infrastructure/role.guard';

const devicesPage = () =>
  import('./views/devices-page/devices-page').then((m) => m.DevicesPage);

/**
 * Route tree for the devices bounded context.
 *
 * @remarks
 * `/devices` is the admin-only screen that binds one vehicle to one MineGuard
 * edge device (a "sensor" resource on the backend). Registration and listing
 * both use the admin's JWT — the company API key is exclusive to the Edge and
 * is never used here.
 */
export const devicesRoutes: Routes = [
  {
    path: '',
    loadComponent: devicesPage,
    canActivate: [roleGuard(['Administrator'])],
  },
];
