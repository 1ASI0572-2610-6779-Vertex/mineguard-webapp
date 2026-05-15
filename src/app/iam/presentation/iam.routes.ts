import { Routes } from '@angular/router';

import { roleGuard } from '../infrastructure/role.guard';

const signInForm = () =>
  import('./views/sign-in-form/sign-in-form').then((m) => m.SignInForm);
const supervisorsPage = () =>
  import('./views/supervisors-page/supervisors-page').then((m) => m.SupervisorsPage);

/*
// Uncomment when Sign-Up self-service view is implemented
const signUpForm = () => import('./views/sign-up-form/sign-up-form').then((m) => m.SignUpForm);
*/

/**
 * Route tree for IAM presentation views.
 *
 * @remarks
 * Sign-Up self-service is intentionally absent: in the MineGuard model, new
 * supervisor accounts are created by an administrator through the
 * "Gestión de Usuarios" admin view, not via a self-service registration.
 *
 * `/iam/sign-in` is the only IAM route reachable without authentication.
 * `/iam/supervisors` is admin-only — `roleGuard(['Administrator'])` enforces
 * both the auth check (`isSignedIn()`) and the role check in one factory.
 */
export const iamRoutes: Routes = [
  { path: 'sign-in', loadComponent: signInForm },
  {
    path: 'supervisors',
    loadComponent: supervisorsPage,
    canActivate: [roleGuard(['Administrator'])],
  },
  /*
  { path: 'sign-up', loadComponent: signUpForm },
  */
];
