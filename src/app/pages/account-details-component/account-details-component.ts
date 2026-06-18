import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AccountService } from '../../services/account/account.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { signal } from '@angular/core';

@Component({
  selector: 'app-account-details-component',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    DatePipe,
  ],
  templateUrl: './account-details-component.html',
  styleUrl: './account-details-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly accountService = inject(AccountService);

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

  readonly amount = new FormControl<number | null>(null, {
    validators: [Validators.required, Validators.min(1)],
  });

  readonly operationType = new FormControl<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT', {
    nonNullable: true,
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

  submitOperation(): void {
    const account = this.account();

    if (!account || this.amount.invalid || this.operationType.invalid) {
      this.amount.markAsTouched();
      this.operationType.markAsTouched();
      return;
    }

    this.accountService.performOperation(
      account.id,
      { amount: this.amount.value ?? 0 },
      this.operationType.value,
    );
    this.amount.reset();
    this.operationType.setValue('DEPOSIT');
    this.refreshKey.update((value) => value + 1);
  }
}
