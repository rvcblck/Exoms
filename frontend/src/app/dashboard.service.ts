import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Program } from './program.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ResponseData } from './dashboard.model';
import { ChartData } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
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

  getDashboard(): Observable<ResponseData> {
    const headers = this.getHeaders();
    return this.http.get<ResponseData>(`${this.apiUrl}/dashboard`, { headers }).pipe(
      tap((response) => {
        console.log('dashboard retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving dashboard:', error);
        return throwError('Error retrieving dashboard. Please try again later.');
      })
    );
  }

  getProgramChart(month: string): Observable<ChartData[]> {
    const headers = this.getHeaders();
    return this.http.get<ChartData[]>(`${this.apiUrl}/dashboard-chart/${month}`, { headers }).pipe(
      tap((response) => {
        console.log('dashboard retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving dashboard:', error);
        return throwError('Error retrieving dashboard. Please try again later.');
      })
    );
  }

  
}
