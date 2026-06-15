import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  onLogin() {
    this.authService.login();
    this.router.navigate(['/my-accounts']);
  }
}
