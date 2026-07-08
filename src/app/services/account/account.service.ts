import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface AccountApi {
  iban: string;
  clientId: string;
  overdraft: number;
  balance: number;
}

export interface Account {
  id: string;
  iban: string;
  clientId: string;
  overdraft: number;
  balance: number;
  type: 'CHECKING' | 'SAVINGS';
  status: 'ACTIVE' | 'BLOCKED';
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  timestamp: string;
}


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/accounts`;

  getAccounts(): Observable<Account[]> {
    return this.http.get<AccountApi[]>(this.apiUrl).pipe(
      map((apiAccounts) =>
        apiAccounts.map((apiAcc) => this.mapApiToAccount(apiAcc))
      ),
      catchError(this.handleError)
    );
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<AccountApi>(`${this.apiUrl}/${id}`).pipe(
      map((apiAcc) => this.mapApiToAccount(apiAcc)),
      catchError(this.handleError)
    );
  }

  getTransactions(accountId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/${accountId}/transactions`).pipe(
      catchError(this.handleError)
    );
  }

  performOperation(accountId: string, payload: { amount: number }, type: 'DEPOSIT' | 'WITHDRAWAL'): Observable<void> {
    const endpoint = type === 'DEPOSIT' ? 'deposit' : 'withdraw';
    return this.http.post<void>(`${this.apiUrl}/${accountId}/${endpoint}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  private mapApiToAccount(apiAcc: AccountApi): Account {
    return {
      id: apiAcc.iban,
      iban: apiAcc.iban,
      clientId: apiAcc.clientId,
      overdraft: apiAcc.overdraft,
      balance: apiAcc.balance,
      type: 'CHECKING',
      status: 'ACTIVE'
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue.';
    console.error('Erreur API Accounts:', error);

    if (error.error && typeof error.error.error === 'string') {
      errorMessage = error.error.error;
    }
    else if (error.status === 400) {
      errorMessage = 'Montant invalide ou requête malformée.';
    } else if (error.status === 401 || error.status === 403) {
      errorMessage = 'Session expirée ou droits insuffisants.';
    } else if (error.status === 404) {
      errorMessage = 'Compte introuvable.';
    }

    return throwError(() => new Error(errorMessage));
  }
}