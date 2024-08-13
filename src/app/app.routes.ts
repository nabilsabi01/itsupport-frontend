import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'equipment',
        canActivate: [roleGuard(['ROLE_ADMIN'])],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/equipments/equipment-list/equipment-list.component'
              ).then((m) => m.EquipmentListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import(
                './features/equipments/equipment-form/equipment-form.component'
              ).then((m) => m.EquipmentFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import(
                './features/equipments/equipment-form/equipment-form.component'
              ).then((m) => m.EquipmentFormComponent),
          },
        ],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'accounts',
        canActivate: [roleGuard(['ROLE_ADMIN'])],
        loadComponent: () =>
          import(
            './features/accounts/account-list/account-list.component'
          ).then((m) => m.AccountListComponent),
      },
      {
        path: 'accounts/new',
        canActivate: [roleGuard(['ROLE_ADMIN'])],
        loadComponent: () =>
          import(
            './features/accounts/account-form/account-form.component'
          ).then((m) => m.AccountFormComponent),
      },
      {
        path: 'accounts/edit/:id',
        canActivate: [roleGuard(['ROLE_ADMIN'])],
        loadComponent: () =>
          import(
            './features/accounts/account-form/account-form.component'
          ).then((m) => m.AccountFormComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];