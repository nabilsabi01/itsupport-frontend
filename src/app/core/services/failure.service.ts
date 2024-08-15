// failure.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Failure } from '../models/failure';

@Injectable({
  providedIn: 'root'
})
export class FailureService {
  private apiUrl = 'http://localhost:8080/api/failures';

  constructor(private http: HttpClient) {}

  getFailures(): Observable<Failure[]> {
    return this.http.get<Failure[]>(this.apiUrl);
  }

  getFailure(id: number): Observable<Failure> {
    return this.http.get<Failure>(`${this.apiUrl}/${id}`);
  }

  createFailure(failure: Failure): Observable<Failure> {
    return this.http.post<Failure>(this.apiUrl, failure);
  }

  updateFailure(id: number, failure: Failure): Observable<Failure> {
    return this.http.put<Failure>(`${this.apiUrl}/${id}`, failure);
  }

  deleteFailure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}