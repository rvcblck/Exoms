import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Program } from './program.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  getUserInfo(user_id: string): Observable<Profile> {
    const headers = this.getHeaders();

    return this.http.get<Profile>(`${this.apiUrl}/profileInfo/${user_id}`, { headers }).pipe(
      tap((response: Profile) => {}),
      catchError((error) => {
        throw error;
      })
    );
  }

  updateProfile(user: any) {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/updateProfile`, user, { headers }).pipe(
      tap((response) => {}),
      catchError((errorResponse) => {
        return throwError(errorResponse);
      })
    );
  }

  isEmailAvailable(email: string) {
    const headers = this.getHeaders();

    return this.http.get<any>(`${this.apiUrl}/isEmailAvailable/${email}`, { headers }).pipe(
      tap((response: any) => {}),
      catchError((error) => {
        throw error;
      })
    );
  }

  changeEmail(emailData: any) {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/changeEmail`, emailData, { headers }).pipe(
      tap((response) => {}),
      catchError((errorResponse) => {
        return throwError(errorResponse);
      })
    );
  }

  changePass(passData: any) {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/changePass`, passData, { headers }).pipe(
      tap((response) => {}),
      catchError((errorResponse) => {
        return throwError(errorResponse);
      })
    );
  }

  updateProfilePic(profile_pic: any) {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/changeProfilePic`, profile_pic, { headers }).pipe(
      tap((response) => {}),
      catchError((errorResponse) => {
        return throwError(errorResponse);
      })
    );
  }
}
