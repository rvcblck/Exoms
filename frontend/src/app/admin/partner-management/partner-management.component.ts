// import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PartnerService } from 'src/app/partner.service';
import { Partner } from 'src/app/partner.model';
import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ViewPartnerComponent } from '../modal/view-partner/view-partner.component';
import { CreatePartnerComponent } from '../modal/create-partner/create-partner.component';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';
import { TitleService } from 'src/app/title.service';

@Component({
  selector: 'app-partner-management',
  templateUrl: './partner-management.component.html',
  styleUrls: ['./partner-management.component.css']
})
export class PartnerManagementComponent implements OnInit {
  activeContracts!: any[];
  expiredContracts!: any[];
  allPartners!: any[];
  moaStatus!: any;
  selectedStatus = 'all';
  constructor(
    private partnerService: PartnerService,
    private dialog: MatDialog,
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private titleService: TitleService
  ) {}
  loading = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  dataSource = new MatTableDataSource<Partner>();
  displayedColumns: string[] = ['company_name', 'address', 'contact_no', 'contract_dates', 'action'];

  ngOnInit(): void {
    const pageTitle = 'Partner Management';
    this.titleService.titleChange.emit(pageTitle);
    this.cdr.detectChanges();
    this.getPartner();
  }

  getPartner() {
    this.partnerService.getAllPartners().subscribe((partners) => {
      this.loading = true;
      this.dataSource.data = partners;
    });

    this.partnerService.getAllPartners().subscribe((partners) => {
      this.allPartners = partners;
      this.dataSource.data = partners;
      this.dataSource.sort = this.sort;
      this.dataSource.sort.direction = 'desc';
      this.dataSource.sort.active = 'contract_dates';
      this.activeContracts = partners.filter((partner) => {
        const endDate = new Date(partner.contracts.end_date);
        return endDate > new Date();
      });
      this.expiredContracts = partners.filter((partner) => {
        const endDate = new Date(partner.contracts.end_date);
        return endDate <= new Date();
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.dataSource.sort = this.sort));

    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'contract_dates':
          return item.contracts.start_date;
        default:
          return item[property];
      }
    };

    const statusSelect = document.getElementById('status-select');
    const arrowIcon = document.querySelector('.status .arrow-icon');

    statusSelect?.addEventListener('click', function () {
      arrowIcon?.classList.toggle('rotate'); /* toggle the rotate class */
    });
  }

  viewPartner(partner_id: string) {
    this.partnerService.getPartnerInfo(partner_id).subscribe(
      (partner) => {
        const dialogRef = this.dialog.open(ViewPartnerComponent, {
          data: { partner: partner },
          maxWidth: '90%',
          minWidth: '40%'
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.getPartner();
          }
        });
      },
      (error) => {
        const message = 'Something Wrong Please Try Again';
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  moaStatusFilter() {
    if (this.selectedStatus === 'active') {
      this.dataSource.data = this.activeContracts;
    } else if (this.selectedStatus === 'expired') {
      this.dataSource.data = this.expiredContracts;
    } else {
      this.dataSource.data = this.allPartners;
    }
    this.moaStatus = this.selectedStatus;
  }

  createAccount() {
    const dialogRef = this.dialog.open(CreatePartnerComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPartner();
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }
}
