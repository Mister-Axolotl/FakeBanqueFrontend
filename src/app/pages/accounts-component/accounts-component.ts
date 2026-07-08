import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AccountService, Account } from '../../services/account/account.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts-component',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './accounts-component.html',
  styleUrl: './accounts-component.scss',
})
export class AccountsComponent implements OnInit {
  authService = inject(AuthService);
  accountService = inject(AccountService);

  accountsList = signal<Account[]>([]);

  get accounts() {
    return this.accountsList();
  }

  ngOnInit(): void {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accountsList.set(data);
      },
      error: (err) => {
        console.error("Impossible de charger les comptes", err);
      }
    });
  }

  getAccountIcon(account: Account): string {
    return account.type === 'SAVINGS' ? 'savings' : 'credit_card';
  }

  getAccountTypeLabel(account: Account): string {
    return account.type === 'SAVINGS' ? "Compte d'épargne" : 'Compte courant';
  }

  getAccountStatusLabel(account: Account): string {
    return account.status === 'ACTIVE' ? 'Actif' : 'Bloqué';
  }
}