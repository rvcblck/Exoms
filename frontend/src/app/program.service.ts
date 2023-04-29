import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OtherDetails, Program } from './program.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
// import { User } from './profile.model';
import { Faculty } from './faculty.model';
import { FacultyProgram } from './faculty.model';
import { ViewProgram } from './program.model';
import { AutoComplete } from './program.model';
import { Attendance } from './attendance.model';
import { ProgramFlow } from './program.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
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

  getPrograms(): Observable<Program[]> {
    const headers = this.getHeaders();
    return this.http.get<Program[]>(`${this.apiUrl}/programs`, { headers }).pipe(
      tap((response) => {
        console.log('Programs retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving programs:', error);
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }

  //for faculty
  getUserPrograms(user_id: string): Observable<Program[]> {
    const headers = this.getHeaders();
    return this.http.get<Program[]>(`${this.apiUrl}/userPrograms/${user_id}`, { headers }).pipe(
      tap((response) => {
        console.log('Programs retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving programs:', error);
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }

  getProgramFlow(user_id: string): Observable<OtherDetails> {
    const headers = this.getHeaders();
    return this.http.get<OtherDetails>(`${this.apiUrl}/program-flow/${user_id}`, { headers }).pipe(
      tap((response) => {
        console.log('Programs retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving programs:', error);
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }

  getProgramInfo(user_id: string): Observable<ViewProgram> {
    const headers = this.getHeaders();

    return this.http.get<ViewProgram>(`${this.apiUrl}/programInfo/${user_id}`, { headers }).pipe(
      tap((response: ViewProgram) => {
        console.log('Program info retrieved successfully:');
      }),
      catchError((error) => {
        console.error('Error retrieving program info:', error);
        throw error;
      })
    );
  }

  createProgram(programData: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(programData);

    console.log((<any>programData).size);
    return this.http.post<any>(`${this.apiUrl}/create-programs`, programData, { headers }).pipe(
      tap((response) => {
        console.log('Program Created successfully');
      }),
      catchError((error) => {
        console.error('Error Creating Program:', error);
        console.error('Error Message:', error.message);
        return throwError('Error Creating Program. Please try again later.');
      })
    );
  }

  updateProgram(programData: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(programData);

    console.log((<any>programData).size);
    return this.http.post<any>(`${this.apiUrl}/update-programs`, programData, { headers }).pipe(
      tap((response) => {
        console.log('Program Updated successfully');
      }),
      catchError((error) => {
        console.error('Error Updated Program:', error);
        console.error('Error Message:', error.message);
        return throwError('Error Updated Program. Please try again later.');
      })
    );
  }

  getAutoComplete(): Observable<AutoComplete[]> {
    const headers = this.getHeaders();
    return this.http.get<AutoComplete[]>(`${this.apiUrl}/autoComplete`, { headers }).pipe(
      tap((response) => {
        console.log('autoComplete retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving autoComplete:', error);
        return throwError('Error retrieving autoComplete. Please try again later.');
      })
    );
  }

  getAttendance(programId: string): Observable<Attendance[]> {
    const headers = this.getHeaders();
    return this.http.get<Attendance[]>(`${this.apiUrl}/attendance/${programId}`, { headers }).pipe(
      tap((response) => {
        console.log('Attendance retrieved successfully');
      }),
      catchError((error) => {
        console.error('Error retrieving Attendance:', error);
        return throwError('Error retrieving Attendance. Please try again later.');
      })
    );
  }

  storeAttendance(storeAttendance: any): Observable<any> {
    const headers = this.getHeaders();
    // console.log(programData);

    // console.log((<any>storeAttendance).size);
    return this.http.post<any>(`${this.apiUrl}/store-attendance`, storeAttendance, { headers }).pipe(
      tap((response) => {
        console.log('Program Created successfully');
      }),
      catchError((error) => {
        console.error('Error Creating Program:', error);
        console.error('Error Message:', error.message);
        return throwError('Error Creating Program. Please try again later.');
      })
    );
  }

  updateProgramFlow(programFlow: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/update-program-flow`, programFlow, { headers }).pipe(
      tap((response) => {
        console.log('Program Updated successfully');
      }),
      catchError((error) => {
        console.error('Error Updated Program:', error);
        console.error('Error Message:', error.message);
        return throwError('Error Updated Program. Please try again later.');
      })
    );
  }

  updateProgramTopic(programTopic: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/update-program-topic`, programTopic, { headers }).pipe(
      tap((response) => {
        console.log('Program Updated successfully');
      }),
      catchError((error) => {
        console.error('Error Updated Program:', error);
        console.error('Error Message:', error.message);
        return throwError('Error Updated Program. Please try again later.');
      })
    );
  }

  updateProgramPosition(programPosition: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/update-program-position`, programPosition, { headers }).pipe(
      tap((response) => {
        console.log('Program Updated successfully');
      }),
      catchError((error) => {
        console.error('Error Updated Program:', error);
        console.error('Error Message:', error.message);
        return throwError('Error Updated Program. Please try again later.');
      })
    );
  }

  unarchive(selectedAccounts: Program[]) {
    const headers = this.getHeaders();
    const program_ids = selectedAccounts.map((account) => account.program_id);
    const requestBody = { program_ids: program_ids };
    return this.http.post(`${this.apiUrl}/unarchived-program`, requestBody, { headers }).pipe(
      tap(() => {}),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  archive(program_id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/archive-program/${program_id}`, { headers }).pipe(
      tap((response: any) => {}),
      catchError((error) => {
        throw error;
      })
    );
  }

  getAllProgramsArchived(): Observable<Program[]> {
    const headers = this.getHeaders();
    return this.http.get<Program[]>(`${this.apiUrl}/get-archive-programs`, { headers }).pipe(
      tap((response) => {}),
      catchError((error) => {
        return throwError('Error retrieving programs. Please try again later.');
      })
    );
  }
}
