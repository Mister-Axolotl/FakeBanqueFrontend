import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewTransactionComponent } from '../new-transaction-component/new-transaction-component';

@Component({
  selector: 'app-account-details-component',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    DatePipe,
  ],
  templateUrl: './account-details-component.html',
  styleUrl: './account-details-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly accountService = inject(AccountService);
  private readonly dialog = inject(MatDialog);

  readonly accountId = toSignal(
    this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('id')))),
    { initialValue: NaN },
  );

  private readonly refreshKey = signal(0);

  readonly account = computed(() => {
    this.refreshKey();
    return this.accountService.getAccountById(this.accountId());
  });

  readonly transactions = computed(() => {
    this.refreshKey();
    const account = this.account();
    return account ? this.accountService.getTransactions(account.id) : [];
  });

  readonly typeLabel = computed(() => {
    const account = this.account();
    if (!account) {
      return '';
    }
    return account.type === 'SAVINGS' ? 'Compte épargne' : 'Compte courant';
  });

  readonly tone = computed(() => {
    const account = this.account();
    return account?.type === 'SAVINGS' ? 'savings' : 'checking';
  });

  getAccountIcon(account: any): string {
    return account.type === 'SAVINGS' ? 'savings' : 'credit_card';
  }

  getAccountTypeLabel(account: any): string {
    return account.type === 'SAVINGS' ? "Compte d'épargne" : 'Compte courant';
  }

  getAccountStatusLabel(account: any): string {
    return account.status === 'ACTIVE' ? 'Actif' : 'Bloqué';
  }

  getTransactionTypeLabel(type: 'DEPOSIT' | 'WITHDRAWAL'): string {
    return type === 'DEPOSIT' ? 'Dépôt' : 'Retrait';
  }

  getTransactionIcon(type: 'DEPOSIT' | 'WITHDRAWAL'): string {
    return type === 'DEPOSIT' ? 'south_west' : 'north_east';
  }

  openOperationDialog(): void {
    const account = this.account();

    if (!account || account.status !== 'ACTIVE') {
      return;
    }

    const dialogRef = this.dialog.open(NewTransactionComponent, {
      width: '400px',
      autoFocus: 'first-tabbable'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.accountService.performOperation(
          account.id,
          { amount: result.amount },
          result.type,
        );

        this.refreshKey.update((value) => value + 1);
      }
    });
  }
}