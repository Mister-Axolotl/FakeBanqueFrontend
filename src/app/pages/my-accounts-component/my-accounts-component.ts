import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-my-accounts-component',
  imports: [],
  templateUrl: './my-accounts-component.html',
  styleUrl: './my-accounts-component.scss',
})
export class MyAccountsComponent {
  authService = inject(AuthService);
}
