import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Accounts } from './account.model';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ViewAccount } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8000/api';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  getAccounts(): Observable<Accounts[]> {
    const headers = this.getHeaders();
    return this.http.get<Accounts[]>(`${this.apiUrl}/accounts`, { headers });
  }

  getAccountInfo(user_id: string): Observable<ViewAccount> {
    const headers = this.getHeaders();
    return this.http.get<ViewAccount>(`${this.apiUrl}/accountInfo/${user_id}`, { headers }).pipe(
      tap((response: ViewAccount) => {
        console.log('Account info retrieved successfully:', response);
      }),
      catchError((error) => {
        console.error('Error retrieving account info:', error);
        throw error;
      })
    );
  }

  createAccount(account: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/accounts`, account, { headers }).pipe(
      tap((response) => {
        // localStorage.setItem('email', user.email);
        // localStorage.setItem('password', user.password);
        // this.router.navigate(['/verify-email']);
        return response.message;
      }),
      catchError((errorResponse) => {
        return throwError(errorResponse);
      })
    );
  }

  updateAccount(account: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/accounts/${account.id}`, account, { headers });
  }

  deleteAccount(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.apiUrl}/accounts/${id}`, { headers });
  }

  approveUser(selectedAccounts: Accounts[]) {
    const headers = this.getHeaders();
    const accountIds = selectedAccounts.map((account) => account.user_id);
    const requestBody = { accountIds: accountIds };
    return this.http.post(`${this.apiUrl}/approve-accounts`, requestBody, { headers }).pipe(
      tap(() => console.log('Accounts approved successfully')),
      catchError((error) => {
        console.error('Error approving accounts:', error);
        return throwError(error);
      })
    );
  }

  disapproveUser(selectedAccounts: Accounts[]) {
    const headers = this.getHeaders();
    const accountIds = selectedAccounts.map((account) => account.user_id);
    const requestBody = { accountIds: accountIds };
    return this.http.post(`${this.apiUrl}/disapprove-accounts`, requestBody, { headers }).pipe(
      tap(() => console.log('Accounts disapproved successfully')),
      catchError((error) => {
        console.error('Error disapproving accounts:', error);
        return throwError(error);
      })
    );
  }
}
