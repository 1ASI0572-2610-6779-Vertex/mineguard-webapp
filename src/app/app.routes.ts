import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { iamGuard } from './iam/infrastructure/iam.guard';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const iamRoutes = () => import('./iam/presentation/iam.routes').then((m) => m.iamRoutes);

const baseTitle = 'MineGuard';

/**
 * Root route configuration that composes bounded-context routes.
 *
 * @remarks
 * Every route except `/iam/**` requires an authenticated session via {@link iamGuard}.
 * Role-restricted child routes apply `roleGuard([...])` inside their own bounded
 * context routes file (see `iam.routes.ts`).
 *
 * Additional bounded contexts (analytics, monitoring, assets) are introduced
 * by their own feature commits and will extend this configuration.
 */
export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home`, canActivate: [iamGuard] },
  { path: 'about', loadComponent: about, title: `${baseTitle} - About`, canActivate: [iamGuard] },
  { path: 'iam', loadChildren: iamRoutes },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`,
    canActivate: [iamGuard],
  },
];
