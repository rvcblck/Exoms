import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Accounts, SelectAccount } from './account.model';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ViewAccount } from './account.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrl;
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

  getSelectAccounts(): Observable<SelectAccount[]> {
    const headers = this.getHeaders();
    return this.http.get<SelectAccount[]>(`${this.apiUrl}/select-accounts`, { headers });
  }

  getAccountInfo(user_id: string): Observable<ViewAccount> {
    const headers = this.getHeaders();
    return this.http.get<ViewAccount>(`${this.apiUrl}/accountInfo/${user_id}`, { headers }).pipe(
      tap((response: ViewAccount) => {}),
      catchError((error) => {
        throw error;
      })
    );
  }

  createAccount(account: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/accounts`, account, { headers }).pipe(
      tap((response) => {
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
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  disapproveUser(selectedAccounts: Accounts[]) {
    const headers = this.getHeaders();
    const accountIds = selectedAccounts.map((account) => account.user_id);
    const requestBody = { accountIds: accountIds };
    return this.http.post(`${this.apiUrl}/disapprove-accounts`, requestBody, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  unarchive(selectedAccounts: Accounts[]) {
    const headers = this.getHeaders();
    const user_ids = selectedAccounts.map((account) => account.user_id);
    const requestBody = { user_ids: user_ids };
    return this.http.post(`${this.apiUrl}/unarchived-account`, requestBody, { headers }).pipe(
      tap(() => {}),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  archive(user_id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/archive-account/${user_id}`, { headers }).pipe(
      tap((response: any) => {}),
      catchError((error) => {
        throw error;
      })
    );
  }

  getAllUserArchived(): Observable<Accounts[]> {
    const headers = this.getHeaders();
    return this.http.get<Accounts[]>(`${this.apiUrl}/get-archive-accounts`, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }
}
