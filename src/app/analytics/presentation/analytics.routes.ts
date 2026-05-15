import { Routes } from '@angular/router';

const dashboardPage = () =>
  import('./views/dashboard-page/dashboard-page').then((m) => m.DashboardPage);
const reportsPage = () => import('./views/reports-page/reports-page').then((m) => m.ReportsPage);

/**
 * Route tree for the analytics bounded context.
 */
export const analyticsRoutes: Routes = [
  { path: 'dashboard', loadComponent: dashboardPage },
  { path: 'reports', loadComponent: reportsPage },
];
