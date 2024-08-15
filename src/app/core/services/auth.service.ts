import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponseDTO } from '../models/AuthResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.value;

    if (currentUser && currentUser.roles) {
      return currentUser.roles.some((r: any) => r.authority === role);
    }
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<AuthResponseDTO>(`http://localhost:8080/api/auth/authenticate`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          localStorage.setItem('accessToken', response.token);
          const user = this.parseJwt(response.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
