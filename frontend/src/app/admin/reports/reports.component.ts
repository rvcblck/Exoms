import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(private adminLayout: AdminLayoutComponent, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.adminLayout.pageTitle = 'Reports';
    // this.cdr.detectChanges();
  }
}
