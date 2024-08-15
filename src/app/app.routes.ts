import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './features/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: 'equipments',
        // canActivate: [roleGuard(['ROLE_ADMIN'])],
        children: [
          {
            path: '',
            loadComponent: () => import('./features/equipments/equipment-list/equipment-list.component').then(m => m.EquipmentListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/equipments/equipment-form/equipment-form.component').then(m => m.EquipmentFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/equipments/equipment-form/equipment-form.component').then(m => m.EquipmentFormComponent)
          }
        ]
      },
      {
        path: 'tickets',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/tickets/ticket-list/ticket-list.component').then(m => m.TicketListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/tickets/ticket-form/ticket-form.component').then(m => m.TicketFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/tickets/ticket-form/ticket-form.component').then(m => m.TicketFormComponent)
          },
        ]
      },
      {
        path: 'failures',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/failures/failure-list/failure-list.component').then(m => m.FailureListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/failures/failure-form/failure-form.component').then(m => m.FailureFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/failures/failure-form/failure-form.component').then(m => m.FailureFormComponent)
          },
        ]
      },
      {
        path: 'accounts',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/accounts/account-list/account-list.component').then(m => m.AccountListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/accounts/account-form/account-form.component').then(m => m.AccountFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/accounts/account-form/account-form.component').then(m => m.AccountFormComponent)
          }
        ]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];