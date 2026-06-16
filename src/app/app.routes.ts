import { Routes } from '@angular/router';
import { iamGuard } from './iam/infrastructure/iam.guard';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const analyticsRoutes = () =>
  import('./analytics/presentation/analytics.routes').then((m) => m.analyticsRoutes);
const assetsRoutes = () =>
  import('./assets/presentation/assets.routes').then((m) => m.assetsRoutes);
const iamRoutes = () => import('./iam/presentation/iam.routes').then((m) => m.iamRoutes);
const serviceDesignRoutes = () =>
  import('./service/presentation/service-design.routes')
    .then((m) => m.serviceDesignRoutes);

const monitoringRoutes = () =>
  import('./monitoring/presentation/monitoring.routes').then((m) => m.monitoringRoutes);

const baseTitle = 'MineGuard';

/**
 * Root route configuration that composes bounded-context routes.
 *
 * @remarks
 * Every route except `/iam/**` requires an authenticated session via {@link iamGuard}.
 * Role-restricted child routes apply `roleGuard([...])` inside their own bounded
 * context routes file (see `analytics.routes.ts`, `iam.routes.ts`, etc.).
 */
export const routes: Routes = [
  { path: 'about', loadComponent: about, title: `${baseTitle} - About`, canActivate: [iamGuard] },
  { path: 'iam', loadChildren: iamRoutes },
  { path: 'analytics', loadChildren: analyticsRoutes, canActivate: [iamGuard] },
  { path: 'monitoring', loadChildren: monitoringRoutes, canActivate: [iamGuard] },
  { path: 'assets', loadChildren: assetsRoutes, canActivate: [iamGuard] },
  { path: 'service', loadChildren: serviceDesignRoutes, canActivate: [iamGuard] },
  { path: '', redirectTo: '/iam/sign-in', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`,
    canActivate: [iamGuard],
  },
];
