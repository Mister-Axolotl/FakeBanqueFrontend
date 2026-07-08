import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from '../../services/account/account.service';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './new-account-component.html',
  styleUrl: './new-account-component.scss'
})
export class NewAccountComponent {
  private dialogRef = inject(MatDialogRef<NewAccountComponent>);
  private accountService = inject(AccountService);

  isLoading = signal(false);
  errorMessage = signal('');

  form = new FormGroup({
    iban: new FormControl('', [Validators.required]),
    balance: new FormControl(0, [Validators.required]),
    overdraft: new FormControl(-500, [Validators.required, Validators.max(0)])
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.accountService.createAccount({
      iban: this.form.value.iban!,
      balance: this.form.value.balance!,
      overdraft: this.form.value.overdraft!
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message);
      }
    });
  }
}