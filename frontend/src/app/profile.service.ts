import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Program } from './program.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/api';
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
      tap((response: Profile) => {
        console.log('Profile info retrieved successfully:');
      }),
      catchError((error) => {
        console.error('Error retrieving Profile info:', error);
        throw error;
      })
    );
  }
}
