import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-transaction-component',
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

  operationType = new FormControl<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT', { nonNullable: true });
  amount = new FormControl<number | null>(null, [Validators.required, Validators.min(1)]);

  submitOperation(): void {
    if (this.amount.valid && this.operationType.valid) {
      this.dialogRef.close({
        type: this.operationType.value,
        amount: this.amount.value
      });
    } else {
      this.amount.markAsTouched();
    }
  }
}
