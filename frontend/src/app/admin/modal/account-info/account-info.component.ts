import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// import { Accounts } from 'src/app/account.model';
import { ViewAccount } from 'src/app/account.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { SuccessComponent } from 'src/app/dialog/success/success.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';
import { AccountService } from 'src/app/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  programs: any[] = [];
  previousCount: number = 0;
  ongoingCount: number = 0;
  upcomingCount: number = 0;
  showTableOngoing: boolean = false;
  showTablePrevious: boolean = false;
  showTableUpcoming: boolean = false;

  private apiUrl = environment.apiUrl;
  public imageUrl: any;

  constructor(
    public dialogRef: MatDialogRef<AccountInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account: ViewAccount },
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private dialog: MatDialog,
    private accountService: AccountService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  ngOnInit(): void {
    this.getImage().subscribe((data: Blob) => {
      const imageUrl = URL.createObjectURL(data);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getImage() {
    // const filename = 'samplepic.jpg';
    const headers = this.getHeaders();
    const user_id = this.data.account.user_id;
    return this.http.get(`${this.apiUrl}/profile-image/${user_id}`, { headers, responseType: 'blob' });
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  archive(): void {
    const message = 'Are you sure you want to archive this user?';
    const header = 'Archive User';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        header: header,
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // The user confirmed the action, submit the form
        this.archiveConfirmed();
      }
    });
  }

  archiveConfirmed() {
    const program_id = this.data.account.user_id;
    this.accountService.archive(program_id).subscribe(
      (program) => {
        const message = 'Program archived successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
        this.dialogRef.close(true);
      },
      (error) => {
        // TODO: Handle error
        const message = 'Error archiving program';
        const header = 'Error';
        const dialogRef = this.dialog.open(ErrorComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      }
    );
  }
}
