import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from '../../services/account/account.service';

@Component({
  selector: 'app-new-transaction-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './new-transaction-component.html',
  styleUrl: './new-transaction-component.scss',
})
export class NewTransactionComponent {
  private dialogRef = inject(MatDialogRef<NewTransactionComponent>);
  private dialog = inject(MatDialog);
  private data = inject<{ accountId: string }>(MAT_DIALOG_DATA);
  private accountService = inject(AccountService);

  @ViewChild('errorDialog') errorDialogTemplate!: TemplateRef<any>;

  errorMessage = signal('');
  isLoading = signal(false);

  operationType = new FormControl<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT', { nonNullable: true });
  amount = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);

  submitOperation(): void {
    if (this.amount.invalid || this.operationType.invalid) {
      this.amount.markAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.accountService.performOperation(
      this.data.accountId,
      { amount: this.amount.value! },
      this.operationType.value
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message);

        this.dialog.open(this.errorDialogTemplate, {
          width: '350px',
          disableClose: true
        });
      }
    });
  }
}