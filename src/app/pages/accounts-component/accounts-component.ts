import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../services/account/account.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accounts-component',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './accounts-component.html',
  styleUrl: './accounts-component.scss',
})
export class AccountsComponent {
  authService = inject(AuthService);
  accountService = inject(AccountService);

  get accounts() {
    return this.accountService.getAccounts();
  }

  getAccountIcon(account: any): string {
    return account.type === 'SAVINGS' ? 'savings' : 'credit_card';
  }

  getAccountTypeLabel(account: any): string {
    return account.type === 'SAVINGS' ? "Compte d'épargne" : 'Compte courant';
  }

  getAccountStatusLabel(account: any): string {
    return account.status === 'ACTIVE' ? 'Actif' : 'Bloqué';
  }
}
