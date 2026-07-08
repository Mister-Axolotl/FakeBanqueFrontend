import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly COOKIE_NAME = 'auth_token';
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}`;
  private readonly apiUrl = `${environment.apiUrl}`;

  readonly isLoggedIn = signal(false);
  readonly currentUser = signal<UserProfile | null>(null);

  constructor() {
    const hasToken = this.getCookie(this.COOKIE_NAME) !== null;
    this.isLoggedIn.set(hasToken);

    if (hasToken) {
      this.fetchMe().subscribe();
    }
  }

  me(): UserProfile | null {
    return this.currentUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials, { headers }).pipe(
      tap((response) => {
        this.setCookie(this.COOKIE_NAME, response.access_token, 1);
        this.isLoggedIn.set(true);
        this.fetchMe().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  register(userData: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  logout() {
    this.deleteCookie(this.COOKIE_NAME);
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }

  private fetchMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/clients/me`).pipe(
      tap((profile) => this.currentUser.set(profile)),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'Identifiants incorrects.';
      } else {
        errorMessage = `Erreur serveur (${error.status}).`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  public getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
  }
}
