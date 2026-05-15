import { Routes } from '@angular/router';

import { roleGuard } from '../../iam/infrastructure/role.guard';

const dashboardPage = () =>
  import('./views/dashboard-page/dashboard-page').then((m) => m.DashboardPage);
const reportsPage = () => import('./views/reports-page/reports-page').then((m) => m.ReportsPage);
const adminSummaryPage = () =>
  import('./views/admin-summary-page/admin-summary-page').then((m) => m.AdminSummaryPage);

/**
 * Route tree for the analytics bounded context.
 *
 * @remarks
 * Each route opts in to its own `roleGuard`:
 * - `/dashboard` and `/reports` → supervisor-only operational views
 * - `/admin-summary` → administrator-only system overview
 */
export const analyticsRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: dashboardPage,
    canActivate: [roleGuard(['Supervisor'])],
  },
  {
    path: 'reports',
    loadComponent: reportsPage,
    canActivate: [roleGuard(['Supervisor'])],
  },
  {
    path: 'admin-summary',
    loadComponent: adminSummaryPage,
    canActivate: [roleGuard(['Administrator'])],
  },
];
