import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly COOKIE_NAME = 'auth_token';
  readonly isLoggedIn = signal(false);
  readonly jwtToken = 'eyJhbGciOiJIUhgthtzI1NiIsInR5chCIrazrat6IkpXVCJ9';

  constructor() {
    this.isLoggedIn.set(this.getCookie(this.COOKIE_NAME) !== null);
  }

  me() {
    return { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
  }

  login() {
    this.setCookie(this.COOKIE_NAME, this.jwtToken, 1);
    this.isLoggedIn.set(true);
  }

  register() {
    this.setCookie(this.COOKIE_NAME, this.jwtToken, 1);
    this.isLoggedIn.set(true);
  }

  logout() {
    this.deleteCookie(this.COOKIE_NAME);
    this.isLoggedIn.set(false);
  }

  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();

    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  private getCookie(name: string): string | null {
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
