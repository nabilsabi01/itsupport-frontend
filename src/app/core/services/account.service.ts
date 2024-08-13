import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../core/models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `http://localhost:8080/api/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(
      `http://localhost:8080/api/v1/auth/register`,
      account
    );
  }

  updateAccount(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
