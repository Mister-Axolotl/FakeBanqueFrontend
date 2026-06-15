import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login';
import { authGuard } from './guards/auth/auth-guard';
import { MyAccountsComponent } from './pages/my-accounts-component/my-accounts-component';
import { ProfileComponent } from './pages/profile-component/profile-component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'my-accounts',
    component: MyAccountsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/my-accounts', pathMatch: 'full' },
  { path: '**', redirectTo: '/my-accounts' },
];
