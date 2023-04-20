import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewPartner } from 'src/app/partner.model';

@Component({
  selector: 'app-view-partner',
  templateUrl: './view-partner.component.html',
  styleUrls: ['./view-partner.component.css']
})
export class ViewPartnerComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ViewPartnerComponent>, @Inject(MAT_DIALOG_DATA) public data: { partner: ViewPartner }) {}

  ngOnInit(): void {
    console.log(this.data.partner);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  closeDialog(){
    this.dialogRef.close();
  }

  editProgram(partner_id:string){
    this.dialogRef.close();
  }
}
