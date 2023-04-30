import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';

interface UserInfo {
  firstName: string;
  role: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('firstName', response.user.fname);
        localStorage.setItem('fullName', response.user.lname + ', ' + response.user.fname);
        localStorage.setItem('role', response.user.role);
        localStorage.setItem('user_id', response.user.user_id);
      }),
      catchError((error) => {
        if (error.status === 401) {
          if (error.error.message === 'Email is not yet validated') {
            return throwError('Email is not yet validated');
          } else {
            return throwError('Invalid email or password');
          }
        }
        return throwError('An error occurred while logging in');
      })
    );
  }

  sendEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-email`, { email }).pipe(
      tap((response) => {
        localStorage.setItem('email', response.email);
        return response;
      }),
      catchError((error) => {
        return throwError('An error occurred while logging in');
      })
    );
  }

  register(user: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user).pipe(
      tap((response) => {
        localStorage.setItem('email', user.email);
        localStorage.setItem('password', user.password);
        this.router.navigate(['/verify-email']);
        return response;
      }),
      catchError((errorResponse) => {
        // if (errorResponse.status === 401 && errorResponse.error.error === 'Email is already registered') {
        //   return throwError('Email is already registered');
        // }
        return throwError(errorResponse);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('role');
    localStorage.removeItem('month');
    localStorage.removeItem('password');
    localStorage.removeItem('email');
    localStorage.removeItem('quote');
    localStorage.removeItem('author');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  isUser(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const role = this.jwtHelper.decodeToken(token).role;
    return role === 'user';
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const role = this.jwtHelper.decodeToken(token).role;
    return role === 'admin';
  }

  getAuthenticatedUserInfo(): UserInfo {
    const token = localStorage.getItem('token');
    if (!token) {
      return { firstName: '', role: '' };
    }
    const jwtHelper = new JwtHelperService();
    const firstName = localStorage.getItem('firstName');

    const decodedToken = jwtHelper.decodeToken(token);
    const role = localStorage.getItem('role');
    return {
      firstName: firstName ? firstName : decodedToken.firstName || '',
      role: role || ''
    };
  }
  // verifyEmail(token: string) {
  //   return this.http.post<{ message: string }>(`${this.apiUrl}/verify-email`, { token });
  // }

  resendVerificationCode(email: string): Observable<any> {
    const url = `${this.apiUrl}/email/resend-verification-code`;
    return this.http.post<any>(url, { email }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  verifyCode(email: string, code: string): Observable<any> {
    const url = `${this.apiUrl}/verify-email`;
    const data = { email, code };
    return this.http.post<any>(url, data).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgot-password`;
    const data = { email };
    return this.http.post<any>(url, data).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  checkResetToken(resetToken: string): Observable<{ success: boolean; message: string }> {
    const url = `${this.apiUrl}/reset-password/${encodeURIComponent(resetToken)}`;
    return this.http.get<{ success: boolean; message: string }>(url).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  resetPassword(resetToken: string, password: string): Observable<{ success: boolean; message: string }> {
    const url = `${this.apiUrl}/reset-password`;
    const email = localStorage.getItem('email');
    const data = { resetToken, password, email };
    return this.http.post<{ success: boolean; message: string }>(url, data).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
