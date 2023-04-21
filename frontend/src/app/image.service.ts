import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { FileView } from './file.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getImage() {
    const filename = 'logo.png';
    return this.http.get(`${this.apiUrl}/images/${filename}`, { responseType: 'blob' });
  }

  viewFile(filePath: string): Observable<any> {
    console.log(filePath);
    const body = { filePath };
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/program-file`, body).pipe(
      tap((response) => {
        console.log('file retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving file:', error);
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

  // getUserFiles(filePath: string) {
  //   // const url = '/file';
  //   const body = { filePath };
  //   console.log(body, 'eto yung body');
  //   return this.http.post(`${this.apiUrl}/file`, body, { responseType: 'blob' });
  // }

  //   getUserFiles(filePath: string): Observable<File> {
  //     const body = { filePath };
  //     return this.http.post(`${this.apiUrl}/file`, body, { responseType: 'blob', observe: 'response' }).pipe(
  //       map((response) => {
  //         if (!response.body) {
  //           throw new Error('Response body is null');
  //         }
  //         const blob = new Blob([response.body], { type: 'application/pdf' });
  //         const disposition = response.headers.get('Content-Disposition');
  //         const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  //         const matches = disposition ? fileNameRegex.exec(disposition) : null;
  //         const fileName = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'file';
  //         const fileType = this.getFileType(fileName);
  //         const file = new File([blob], fileName, {
  //           type: 'application/pdf', // modify the type to match the expected type
  //           lastModified: new Date().getTime()
  //         });
  //         return file;
  //       })
  //     );
  //   }

  //   getFileType(fileName: string): string {
  //     const fileType = fileName?.split('.').pop()?.toLowerCase(); // Extract the file extension from the file name
  //     switch (fileType) {
  //       case 'pdf':
  //         return 'application/pdf';
  //       case 'png':
  //         return 'image/png';
  //       case 'jpeg':
  //       case 'jpg':
  //         return 'image/jpeg';
  //       // Add other file types as needed
  //       default:
  //         return 'application/octet-stream';
  //     }
  //   }
}
