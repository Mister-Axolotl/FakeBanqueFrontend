import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login';
import { authGuard } from './guards/auth/auth-guard';
import { DashboardComponent } from './pages/dashboard-component/dashboard-component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
