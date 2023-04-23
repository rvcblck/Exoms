import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Accounts } from 'src/app/account.model';
import { ViewAccount } from 'src/app/account.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

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

  private apiUrl = 'http://localhost:8000/api';
  public imageUrl: any;

  constructor(
    public dialogRef: MatDialogRef<AccountInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account: ViewAccount },
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

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
    const user_id = this.data.account.user_id;
    return this.http.get(`${this.apiUrl}/profile-image/${user_id}`, { responseType: 'blob' });
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }
}
