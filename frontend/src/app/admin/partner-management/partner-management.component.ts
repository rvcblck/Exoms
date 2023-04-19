// import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PartnerService } from 'src/app/partner.service';
import { Partner } from 'src/app/partner.model';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewPartnerComponent } from '../modal/view-partner/view-partner.component';
import { CreatePartnerComponent } from '../modal/create-partner/create-partner.component';




@Component({
  selector: 'app-partner-management',
  templateUrl: './partner-management.component.html',
  styleUrls: ['./partner-management.component.css'],
})
export class PartnerManagementComponent implements OnInit {
  constructor(
    private partnerService: PartnerService,
    private dialog: MatDialog
  ) {}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  dataSource = new MatTableDataSource<Partner>();
  displayedColumns: string[] = [
    'company_name',
    'address',
    'contact_no',
    'contract_dates',
    'action',
  ];

  ngOnInit(): void {
    this.partnerService.getAllPartners().subscribe((partners) => {
      this.dataSource.data = partners;
    });

    this.partnerService.getAllPartners().subscribe((partners) => {
      this.dataSource.data = partners;
      this.dataSource.sort = this.sort;
      this.dataSource.sort.direction = 'desc';
      this.dataSource.sort.active = 'contract_dates';
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.dataSource.sort = this.sort));

    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'contract_dates': return item.contracts.start_date;
        default: return item[property];
      }
    };

  }

  viewPartner(partner_id: string) {
    this.partnerService.getPartnerInfo(partner_id).subscribe(
      (partner) => {
        const dialogRef = this.dialog.open(ViewPartnerComponent, {
          data: { partner: partner },
          width: '80%',
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createAccount() {
    const dialogRef = this.dialog.open(CreatePartnerComponent, {
      width: '80%',
    });
  }
}
