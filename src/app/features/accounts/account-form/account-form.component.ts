// account-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../core/models/account';
import { AccountService } from '../../../core/services/account.service';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Role } from '../../../core/enums/role';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  roles: { label: string; value: Role }[];
  isEditMode = false;
  isLoading = false;
  accountId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.accountForm = this.createForm();

    this.roles = Object.keys(Role).map((key) => ({
      label: key,
      value: Role[key as keyof typeof Role],
    }));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.accountId = +id;
      this.loadAccount(this.accountId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: [null, Validators.required],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
    });
  }

  loadAccount(id: number): void {
    this.isLoading = true;
    this.accountService.getAccount(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (account) => {
          console.log('Received account:', account);
          if (account) {
            this.accountForm.patchValue({
              name: account.name,
              email: account.email,
              role: account.role
            });
            this.accountForm.get('password')?.clearValidators();
            this.accountForm.get('password')?.updateValueAndValidity();
          }
        },
        error: (error) => {
          console.error('Error loading account:', error);
          this.showError('Failed to load account. Please try again.');
        }
      });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      this.isLoading = true;
      const accountData: Account = {
        ...this.accountForm.value,
        id: this.isEditMode ? this.accountId : undefined
      };
      
      const operation = this.isEditMode
        ? this.accountService.updateAccount(this.accountId!, accountData)
        : this.accountService.createAccount(accountData);

      operation.pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.showSuccess(this.isEditMode ? 'Account updated successfully' : 'Account created successfully');
            this.navigateToAccounts();
          },
          error: (err) => {
            console.error('Error saving account:', err);
            this.showError('Failed to save account. Please try again.');
          },
        });
    } else {
      this.accountForm.markAllAsTouched();
    }
  }

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  cancel(): void {
    this.navigateToAccounts();
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}