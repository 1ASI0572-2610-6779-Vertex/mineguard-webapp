import { Routes } from '@angular/router';

import { iamGuard } from './iam/infrastructure/iam.guard';
import { roleGuard } from './iam/infrastructure/role.guard';

// ── Auth views (rendered without the app shell) ───────────────────────────
const signInForm = () =>
  import('./iam/presentation/views/sign-in-form/sign-in-form').then((m) => m.SignInForm);
const registerCompanyPage = () =>
  import('./iam/presentation/views/register-company-page/register-company-page').then(
    (m) => m.RegisterCompanyPage,
  );
const changePasswordPage = () =>
  import('./iam/presentation/views/change-password-page/change-password-page').then(
    (m) => m.ChangePasswordPage,
  );
const forgotPasswordPage = () =>
  import('./iam/presentation/views/forgot-password-page/forgot-password-page').then(
    (m) => m.ForgotPasswordPage,
  );

// ── Administrator views ───────────────────────────────────────────────────
const supervisorsPage = () =>
  import('./iam/presentation/views/supervisors-page/supervisors-page').then((m) => m.SupervisorsPage);
const adminSummaryPage = () =>
  import('./analytics/presentation/views/admin-summary-page/admin-summary-page').then(
    (m) => m.AdminSummaryPage,
  );
const auditAndAssetsPage = () =>
  import('./monitoring/presentation/views/audit-and-assets-page/audit-and-assets-page').then(
    (m) => m.AuditAndAssetsPage,
  );
const devicesPage = () =>
  import('./devices/presentation/views/devices-page/devices-page').then((m) => m.DevicesPage);

// ── Supervisor views ──────────────────────────────────────────────────────
const dashboardPage = () =>
  import('./analytics/presentation/views/dashboard-page/dashboard-page').then((m) => m.DashboardPage);
const reportsPage = () =>
  import('./analytics/presentation/views/reports-page/reports-page').then((m) => m.ReportsPage);
const alertsPage = () =>
  import('./monitoring/presentation/views/alerts-page/alerts-page').then((m) => m.AlertsPage);
const liveMapPage = () =>
  import('./monitoring/presentation/views/live-map-page/live-map-page').then((m) => m.LiveMapPage);
const fleetAndDriversPage = () =>
  import('./assets/presentation/views/fleet-and-drivers-page/fleet-and-drivers-page').then(
    (m) => m.FleetAndDriversPage,
  );

// ── Shared views ──────────────────────────────────────────────────────────
const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);

const baseTitle = 'MineGuard';

/**
 * Root route configuration using flat, human-readable URLs.
 *
 * @remarks
 * Auth routes (`/login`, `/register-company`, `/change-password`,
 * `/forgot-password`) render without the app shell — see
 * `Layout.NO_SHELL_ROUTES`. Every other route requires an authenticated
 * session via {@link iamGuard}; role-restricted views additionally apply
 * `roleGuard([...])`. The empty path lands on the sign-in screen.
 */
export const routes: Routes = [
  // Auth (public, no shell)
  { path: 'login', loadComponent: signInForm, title: `${baseTitle} - Sign in` },
  { path: 'register-company', loadComponent: registerCompanyPage, title: `${baseTitle} - Register company` },
  { path: 'change-password', loadComponent: changePasswordPage, title: `${baseTitle} - Change password` },
  { path: 'forgot-password', loadComponent: forgotPasswordPage, title: `${baseTitle} - Forgot password` },

  // Administrator
  {
    path: 'admin-overview',
    loadComponent: adminSummaryPage,
    title: `${baseTitle} - System overview`,
    canActivate: [iamGuard, roleGuard(['Administrator'])],
  },
  {
    path: 'user-management',
    loadComponent: supervisorsPage,
    title: `${baseTitle} - User management`,
    canActivate: [iamGuard, roleGuard(['Administrator'])],
  },
  {
    path: 'audit',
    loadComponent: auditAndAssetsPage,
    title: `${baseTitle} - Audit & assets`,
    canActivate: [iamGuard, roleGuard(['Administrator'])],
  },
  {
    path: 'devices',
    loadComponent: devicesPage,
    title: `${baseTitle} - Devices`,
    canActivate: [iamGuard, roleGuard(['Administrator'])],
  },

  // Supervisor
  {
    path: 'dashboard',
    loadComponent: dashboardPage,
    title: `${baseTitle} - Control center`,
    canActivate: [iamGuard, roleGuard(['Supervisor'])],
  },
  {
    path: 'reports',
    loadComponent: reportsPage,
    title: `${baseTitle} - Reports`,
    canActivate: [iamGuard, roleGuard(['Supervisor'])],
  },
  {
    path: 'alerts',
    loadComponent: alertsPage,
    title: `${baseTitle} - Alerts`,
    canActivate: [iamGuard, roleGuard(['Supervisor'])],
  },
  {
    path: 'live-map',
    loadComponent: liveMapPage,
    title: `${baseTitle} - Live map`,
    canActivate: [iamGuard, roleGuard(['Supervisor'])],
  },
  {
    path: 'fleet',
    loadComponent: fleetAndDriversPage,
    title: `${baseTitle} - Fleet & drivers`,
    canActivate: [iamGuard, roleGuard(['Supervisor'])],
  },

  // Shared
  { path: 'about', loadComponent: about, title: `${baseTitle} - About`, canActivate: [iamGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`,
    canActivate: [iamGuard],
  },
];
