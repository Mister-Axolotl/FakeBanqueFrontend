import { Injectable } from '@angular/core';

export interface AccountDTO {
  id: number;
  type: 'SAVINGS' | 'CHECKING';
  clientId: string;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED' | 'CLOSED';
}

export interface TransactionDTO {
  id: number;
  accountId: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  date: string;
}

export interface OperationRequest {
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private accounts: AccountDTO[] = [
    { id: 1, type: 'SAVINGS', clientId: '123456', balance: 1500, status: 'ACTIVE' },
    { id: 2, type: 'CHECKING', clientId: '123456', balance: 2500, status: 'BLOCKED' },
  ];

  private transactions: TransactionDTO[] = [
    { id: 1, accountId: 1, type: 'DEPOSIT', amount: 500, date: '2024-01-01T10:00:00Z' },
    { id: 2, accountId: 1, type: 'WITHDRAWAL', amount: 200, date: '2024-01-05T15:30:00Z' },
    { id: 3, accountId: 2, type: 'WITHDRAWAL', amount: 15, date: '2025-01-05T15:30:00Z' },
  ];

  getAccounts(): AccountDTO[] {
    return this.accounts;
  }

  getAccountById(accountId: number): AccountDTO | undefined {
    return this.getAccounts().find((account) => account.id === accountId);
  }

  getTransactions(accountId: number): TransactionDTO[] {
    return this.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .sort((firstTransaction, secondTransaction) => {
        return (
          new Date(secondTransaction.date).getTime() - new Date(firstTransaction.date).getTime()
        );
      });
  }

  performOperation(
    accountId: number,
    operation: OperationRequest,
    type: 'DEPOSIT' | 'WITHDRAWAL',
  ): void {
    const account = this.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    if (type === 'DEPOSIT') {
      account.balance += operation.amount;
    } else if (type === 'WITHDRAWAL') {
      if (account.balance < operation.amount) {
        throw new Error('Insufficient funds');
      }
      account.balance -= operation.amount;
    }

    this.transactions.push({
      id: this.transactions.length + 1,
      accountId,
      type,
      amount: operation.amount,
      date: new Date().toISOString(),
    });
  }
}
