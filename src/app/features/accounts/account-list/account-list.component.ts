import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../account.service';
import { Account } from '../../../core/models/account';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {
  accounts: Account[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe(
      (data) => {
        this.accounts = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching accounts', error);
      }
    );
  }

  deleteAccount(id: number): void {
    if (confirm('Are you sure you want to delete this account?')) {
      // this.accountService.deleteAccount(id).subscribe(
      //   () => {
      //     this.loadAccounts();
      //   },
      //   (error) => {
      //     console.error('Error deleting account', error);
      //   }
      // );
    }
  }
}
