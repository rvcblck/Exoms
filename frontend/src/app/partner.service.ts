import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Profile } from './profile.model';
import { Partner } from './partner.model';
import { ViewPartner } from './program.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
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

  getAllPartners(): Observable<Partner[]> {
    const headers = this.getHeaders();
    return this.http.get<Partner[]>(`${this.apiUrl}/partners`, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }

  getPartnerInfo(partner_id: string): Observable<ViewPartner> {
    const headers = this.getHeaders();
    return this.http.get<ViewPartner>(`${this.apiUrl}/partnerInfo/${partner_id}`, { headers }).pipe(
      tap((response: ViewPartner) => {}),
      catchError((error) => {
        throw error;
      })
    );
  }

  createPartner(partnerData: any): Observable<any> {
    const headers = this.getHeaders();
    for (const entry of (<any>partnerData).entries()) {
    }
    return this.http.post<any>(`${this.apiUrl}/create-partner`, partnerData, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error Creating Partner. Please try again later.');
      })
    );
  }

  updatePartner(partnerData: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post<any>(`${this.apiUrl}/update-partner`, partnerData, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error update Partner. Please try again later.');
      })
    );
  }

  extend(extend: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post<any>(`${this.apiUrl}/extend-partner`, extend, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error update Partner. Please try again later.');
      })
    );
  }

  unarchive(selectedPartner: Partner[]) {
    const headers = this.getHeaders();
    const partner_ids = selectedPartner.map((partner) => partner.partner_id);
    const requestBody = { partner_ids: partner_ids };
    return this.http.post(`${this.apiUrl}/unarchived-partner`, requestBody, { headers }).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  archive(partner_id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/archive-partner/${partner_id}`, { headers }).pipe(
      tap((response: ViewPartner) => {}),
      catchError((error) => {
        throw error;
      })
    );
  }

  getAllPartnersArchived(): Observable<Partner[]> {
    const headers = this.getHeaders();
    return this.http.get<Partner[]>(`${this.apiUrl}/get-archive-partners`, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }
}
