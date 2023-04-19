import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Accounts } from 'src/app/account.model';
import { ViewAccount } from 'src/app/account.model';

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

  constructor(
    public dialogRef: MatDialogRef<AccountInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account: ViewAccount }
  ) {

  }

  ngOnInit(): void {
    // console.log(this.data.account);
    // console.log(this.data.account.status);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
