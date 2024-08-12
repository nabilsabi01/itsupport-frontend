import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Account} from '../../../core/models/account';
import { AccountService } from '../../../core/services/account.service';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Role } from '../../../core/enums/role';

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
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  roles: { label: string; value: Role }[];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.roles = Object.keys(Role).map(key => ({
      label: key,
      value: Role[key as keyof typeof Role]
    }));
    }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadAccount(+id);
      this.accountForm.get('password')?.clearValidators();
      this.accountForm.get('password')?.updateValueAndValidity();
    }
  }

  loadAccount(id: number): void {
    this.accountService.getAccount(id).subscribe(
      account => {
        this.accountForm.patchValue(account);
      },
      error => this.showError('Failed to load account')
    );
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const accountData: Account = this.accountForm.value;
      console.log(accountData);
      const operation = this.isEditMode
        ? this.accountService.updateAccount(+this.route.snapshot.paramMap.get('id')!, accountData)
        : this.accountService.createAccount(accountData);
  
      operation.subscribe({
        next: () => {
          this.showSuccess(this.isEditMode ? 'Account updated' : 'Account created');
          this.navigateToAccounts();
        },
        error: () => this.showError('Failed to save account')
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
}