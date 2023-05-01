import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { FileView } from './file.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getImage() {
    const filename = 'logo.png';
    return this.http.get(`${this.apiUrl}/images/${filename}`, { responseType: 'blob' });
  }

  viewFile(filePath: string): Observable<any> {
    const body = { filePath };
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/program-file`, body).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error retrieving file. Please try again later.');
      })
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  downloadFile(program_id: string): Observable<HttpResponse<Blob>> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/download-file/${program_id}`;
    return this.http.get(url, { headers, observe: 'response', responseType: 'blob' });
  }

  downloadCertFile(program_id: string): Observable<HttpResponse<Blob>> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/download-certfile/${program_id}`;
    return this.http.get(url, { headers, observe: 'response', responseType: 'blob' });
  }

  downloadMoaFile(partner_id: string): Observable<HttpResponse<Blob>> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/download-moa/${partner_id}`;
    return this.http.get(url, { headers, observe: 'response', responseType: 'blob' });
  }
}
