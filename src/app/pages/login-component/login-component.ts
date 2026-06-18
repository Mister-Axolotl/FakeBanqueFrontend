import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButton, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  readonly email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  readonly password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  updateErrorMessage(control: FormControl<string>, fieldLabel: string): string {
    if (control.hasError('required')) {
      return `Vous devez entrer un ${fieldLabel}`;
    }

    if (control === this.email && control.hasError('email')) {
      return "L'adresse email n'est pas valide";
    }

    return '';
  }

  getEmailErrorMessage(): string {
    return this.updateErrorMessage(this.email, 'adresse email');
  }

  getPasswordErrorMessage(): string {
    return this.updateErrorMessage(this.password, 'mot de passe');
  }

  onLogin(): void {
    if (this.email.invalid || this.password.invalid) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    } else if (this.email.hasError('email')) {
      return;
    }

    this.authService.login();
    this.router.navigate(['/accounts']);
  }
}
