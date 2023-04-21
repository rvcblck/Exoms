import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile.model';
import { Partner } from './partner.model';
import { ViewPartner } from './program.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
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

  getAllPartners(): Observable<Partner[]> {
    const headers = this.getHeaders();
    return this.http.get<Partner[]>(`${this.apiUrl}/partners`, { headers }).pipe(
      tap((response) => {
        console.log('Partner retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving users:', error);
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }

  getPartnerInfo(partner_id: string): Observable<ViewPartner> {
    const headers = this.getHeaders();
    return this.http.get<ViewPartner>(`${this.apiUrl}/partnerInfo/${partner_id}`, { headers }).pipe(
      tap((response: ViewPartner) => {
        console.log('Partner info retrieved successfully:');
      }),
      catchError((error) => {
        console.error('Error retrieving account info:', error);
        throw error;
      })
    );
  }

  createPartner(partnerData: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(programData);
    for (const entry of (<any>partnerData).entries()) {
      console.log(entry);
    }
    return this.http.post<any>(`${this.apiUrl}/create-partner`, partnerData, { headers }).pipe(
      tap((response) => {
        console.log('Partner Created successfully');
      }),
      catchError((error) => {
        console.error('Error Creating Partner:', error);
        console.error('Error Message:', error.message);
        return throwError('Error Creating Partner. Please try again later.');
      })
    );
  }

  updatePartner(partnerData: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(programData);
    // for (const entry of (<any>partnerData).entries()) {
    //   console.log(entry);
    // }
    return this.http.post<any>(`${this.apiUrl}/update-partner`, partnerData, { headers }).pipe(
      tap((response) => {
        console.log('Partner update successfully');
      }),
      catchError((error) => {
        console.error('Error update Partner:', error);
        console.error('Error Message:', error.message);
        return throwError('Error update Partner. Please try again later.');
      })
    );
  }
}
