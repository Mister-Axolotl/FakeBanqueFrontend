import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  readonly email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  readonly firstName = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  readonly lastName = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
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

  getFirstNameErrorMessage(): string {
    return this.updateErrorMessage(this.firstName, 'prénom');
  }

  getLastNameErrorMessage(): string {
    return this.updateErrorMessage(this.lastName, 'nom');
  }

  getPasswordErrorMessage(): string {
    return this.updateErrorMessage(this.password, 'mot de passe');
  }

  onRegister(): void {
    if (
      this.email.invalid ||
      this.firstName.invalid ||
      this.lastName.invalid ||
      this.password.invalid
    ) {
      this.email.markAsTouched();
      this.firstName.markAsTouched();
      this.lastName.markAsTouched();
      this.password.markAsTouched();
      return;
    } else if (this.email.hasError('email')) {
      return;
    }

    this.authService.register({
      email: this.email.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      password: this.password.value
    }).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      }
    });
  }
}
