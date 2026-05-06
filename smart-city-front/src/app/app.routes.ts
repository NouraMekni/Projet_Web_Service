import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { IncidentManagementComponent } from '../operator/incident-management/incident-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🔥 ADMIN
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMIN' },
  },

  // 🔥 OPERATOR
  {
    path: 'operator-dashboard',
    loadComponent: () =>
      import('../operator/operator-dashboard/operator-dashboard.component').then(
        (m) => m.OperatorDashboardComponent,
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'OPERATOR' },
  },

  // 🔥 Vehicle Management (Nested under operator)
  {
    path: 'operator/vehicles',
    loadComponent: () =>
      import('../operator/vehicle-management/vehicle-management.component').then(
        (m) => m.VehicleManagementComponent,
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'OPERATOR' },
  },

  { path: 'operator/incidents', component: IncidentManagementComponent },

  { path: '**', redirectTo: 'login' },
];
