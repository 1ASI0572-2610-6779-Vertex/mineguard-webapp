import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

/**
 * Factory that builds a route guard restricting access to a set of allowed roles.
 *
 * @remarks
 * In Angular, a guard is a function that controls whether a route can be activated.
 * This factory returns a CanActivateFn configured for the provided role allow-list.
 *
 * The guard:
 * - Reads the current user's role from {@link IamStore}
 * - Allows navigation when the role is present in the allow-list
 * - Redirects to the sign-in page when no user is signed in
 * - Redirects to the home page when the user is signed in but the role is not allowed
 *
 * Use this guard on routes that must be restricted by user segment (e.g., admin-only
 * or supervisor-only views):
 *
 * ```typescript
 * const routes: Routes = [
 *   { path: 'admin-summary', component: AdminSummary, canActivate: [roleGuard(['Administrator'])] },
 *   { path: 'live-map',      component: LiveMap,      canActivate: [roleGuard(['Supervisor'])] }
 * ];
 * ```
 *
 * @param allowedRoles - Roles that grant access to the protected route
 * @returns A {@link CanActivateFn} that enforces the role allow-list
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const store = inject(IamStore);
    const router = inject(Router);

    if (!store.isSignedIn()) {
      router.navigate(['/iam/sign-in']).then();
      return false;
    }

    const currentRole = store.currentRole();
    if (currentRole && allowedRoles.includes(currentRole)) {
      return true;
    }

    router.navigate(['/home']).then();
    return false;
  };
};
