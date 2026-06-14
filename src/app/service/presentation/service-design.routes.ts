import { Routes } from '@angular/router';
import { roleGuard } from '../../iam/infrastructure/role.guard';

const serviceDesignPage = () =>
  import('./page/service-design-page/service-design-page.component')
    .then((m) => m.ServiceDesignPage);

const routeFormPage = () =>
  import('./page/route-form-page/route-form-page.component')
    .then((m) => m.RouteFormPage);

export const serviceDesignRoutes: Routes = [
  {
    path: 'planning',
    loadComponent: serviceDesignPage,
    canActivate: [roleGuard(['Supervisor'])],
    children: [
      {
        path: 'new',
        loadComponent: routeFormPage,
      },
    ],
  },
];
