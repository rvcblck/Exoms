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
}
