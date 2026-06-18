import { Routes } from '@angular/router';

import { roleGuard } from '../infrastructure/role.guard';

const signInForm = () =>
  import('./views/sign-in-form/sign-in-form').then((m) => m.SignInForm);
const changePasswordPage = () =>
  import('./views/change-password-page/change-password-page').then((m) => m.ChangePasswordPage);
const forgotPasswordPage = () =>
  import('./views/forgot-password-page/forgot-password-page').then((m) => m.ForgotPasswordPage);
const supervisorsPage = () =>
  import('./views/supervisors-page/supervisors-page').then((m) => m.SupervisorsPage);

/**
 * IAM route tree.
 *
 * Auth routes (sign-in, change-password, forgot-password) render without the
 * app shell — Layout.NO_SHELL_ROUTES suppresses the sidebar/toolbar for them.
 * The supervisors admin view requires the Administrator role via roleGuard.
 */
export const iamRoutes: Routes = [
  { path: 'sign-in',          loadComponent: signInForm },
  { path: 'change-password',  loadComponent: changePasswordPage },
  { path: 'forgot-password',  loadComponent: forgotPasswordPage },
  {
    path: 'supervisors',
    loadComponent: supervisorsPage,
    canActivate: [roleGuard(['Administrator'])],
  },
];
