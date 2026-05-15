import { Routes } from '@angular/router';

import { roleGuard } from '../../iam/infrastructure/role.guard';

const auditAndAssetsPage = () =>
  import('./views/audit-and-assets-page/audit-and-assets-page').then(
    (m) => m.AuditAndAssetsPage,
  );
const alertsPage = () =>
  import('./views/alerts-page/alerts-page').then((m) => m.AlertsPage);
const liveMapPage = () =>
  import('./views/live-map-page/live-map-page').then((m) => m.LiveMapPage);

/**
 * Route tree for the monitoring bounded context.
 *
 * @remarks
 * - `audit-and-assets` is an admin composite view (imports catalog-summary
 *   cross-BC from `assets/`).
 * - `alerts` is a supervisor view for operational incident management.
 * - `live-map` is a supervisor real-time operations map (Leaflet).
 */
export const monitoringRoutes: Routes = [
  {
    path: 'audit-and-assets',
    loadComponent: auditAndAssetsPage,
    canActivate: [roleGuard(['Administrator'])],
  },
  {
    path: 'alerts',
    loadComponent: alertsPage,
    canActivate: [roleGuard(['Supervisor'])],
  },
  {
    path: 'live-map',
    loadComponent: liveMapPage,
    canActivate: [roleGuard(['Supervisor'])],
  },
];
