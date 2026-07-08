import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, map, switchMap } from 'rxjs';
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
    CommonModule,
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

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  readonly account = toSignal(
    combineLatest([
      this.route.paramMap,
      this.refreshTrigger$
    ]).pipe(
      filter(([paramMap]) => paramMap.has('id')),
      switchMap(([paramMap]) => {
        const id = paramMap.get('id')!;
        return this.accountService.getAccountById(id);
      })
    )
  );

  readonly transactions = toSignal(
    combineLatest([
      this.route.paramMap,
      this.refreshTrigger$
    ]).pipe(
      filter(([paramMap]) => paramMap.has('id')),
      switchMap(([paramMap]) => {
        const id = paramMap.get('id')!;

        return this.accountService.getTransactions(id).pipe(
          map(transactions => {
            return transactions.sort((a, b) => {
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });
          })
        );
      })
    ),
    { initialValue: [] }
  );

  getAccountIcon(account: any): string {
    return account?.type === 'SAVINGS' ? 'savings' : 'credit_card';
  }

  getAccountTypeLabel(account: any): string {
    return account?.type === 'SAVINGS' ? "Compte d'épargne" : 'Compte courant';
  }

  getAccountStatusLabel(account: any): string {
    return account?.status === 'ACTIVE' ? 'Actif' : 'Bloqué';
  }

  getTransactionTypeLabel(type: 'DEPOSIT' | 'WITHDRAWAL'): string {
    return type === 'DEPOSIT' ? 'Dépôt' : 'Retrait';
  }

  getTransactionIcon(type: 'DEPOSIT' | 'WITHDRAWAL'): string {
    return type === 'DEPOSIT' ? 'south_west' : 'north_east';
  }

  openOperationDialog(): void {
    const currentAccount = this.account();
    if (!currentAccount || currentAccount.status !== 'ACTIVE') return;

    const dialogRef = this.dialog.open(NewTransactionComponent, {
      width: '400px',
      autoFocus: 'first-tabbable',
      data: { accountId: currentAccount.id }
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.refreshTrigger$.next();
      }
    });
  }
}