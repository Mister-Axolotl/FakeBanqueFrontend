import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { authGuard } from './guards/auth/auth-guard';
import { ProfileComponent } from './pages/profile-component/profile-component';
import { AccountDetailsComponent } from './pages/account-details-component/account-details-component';
import { AccountsComponent } from './pages/accounts-component/accounts-component';
import { RegisterComponent } from './pages/register-component/register-component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts/:id',
    component: AccountDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/accounts', pathMatch: 'full' },
  { path: '**', redirectTo: '/accounts' },
];
