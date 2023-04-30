import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Accounts } from 'src/app/account.model';
import { AccountService } from 'src/app/account.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AccountInfoComponent } from '../modal/account-info/account-info.component';
import { CreateAccountComponent } from '../modal/create-account/create-account.component';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { SuccessComponent } from 'src/app/dialog/success/success.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';
import { Program } from 'src/app/program.model';
import { ProgramService } from 'src/app/program.service';
import { PartnerService } from 'src/app/partner.service';
import { Partner } from 'src/app/partner.model';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent {
  // Program
  dataSource = new MatTableDataSource<Program>();
  selection = new SelectionModel<Program>(true, []);
  dataToCall: string[] = ['select', 'title', 'place', 'start_date', 'end_date'];
  showSelectAllButton = false;
  loading = false;

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;

  // Partner
  dataSourcePartner = new MatTableDataSource<Partner>();
  selectionPartner = new SelectionModel<Partner>(true, []);
  dataToCallPartner: string[] = ['select', 'company_name', 'address', 'contact_no', 'contract_dates'];
  showSelectAllButtonPartner = false;

  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('sort2') sort2!: MatSort;

  //
  dataSourceAccount = new MatTableDataSource<Accounts>();
  selectionAccount = new SelectionModel<Accounts>(true, []);
  dataToCallAccount: string[] = ['select', 'fname', 'email', 'mobile_no'];
  showSelectAllButtonAccount = false;

  @ViewChild('paginator3') paginator3!: MatPaginator;
  @ViewChild('sort3') sort3!: MatSort;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private programService: ProgramService,
    private partnerService: PartnerService
  ) {}

  ngOnInit() {
    // program
    this.programService.getAllProgramsArchived().subscribe((programs) => {
      this.dataSource.data = programs;

      this.loading = true;
    });

    //partner
    this.partnerService.getAllPartnersArchived().subscribe((partners) => {
      this.loading = true;
      this.dataSourcePartner.data = partners;
    });

    this.accountService.getAllUserArchived().subscribe((accounts) => {
      this.dataSourceAccount.data = accounts;
      this.loading = true;
    });
  }
  ngAfterViewInit() {
    // program
    this.dataSource.paginator = this.paginator1;
    this.dataSource.sort = this.sort1;
    this.sort1.sortChange.subscribe(() => (this.dataSource.sort = this.sort1));

    //partner
    this.dataSourcePartner.paginator = this.paginator2;
    this.dataSourcePartner.sort = this.sort2;
    this.sort2.sortChange.subscribe(() => (this.dataSourcePartner.sort = this.sort2));
    this.dataSourcePartner.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'contract_dates':
          return item.contracts.start_date;
        default:
          return item[property];
      }
    };

    //account
    this.dataSourceAccount.paginator = this.paginator3;
    this.dataSourceAccount.sort = this.sort3;
    this.sort3.sortChange.subscribe(() => (this.dataSourceAccount.sort = this.sort3));
  }

  //program
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //partner
  applyFilterPartner(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePartner.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePartner.paginator) {
      this.dataSourcePartner.paginator.firstPage();
    }
  }

  //account
  applyFilterAccount(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAccount.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAccount.paginator) {
      this.dataSourceAccount.paginator.firstPage();
    }
  }

  //program
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  //partner
  isAllSelectedPartner() {
    const numSelected = this.selectionPartner.selected.length;
    const numRows = this.dataSourcePartner.data.length;
    return numSelected === numRows;
  }

  //partner
  isAllSelectedAccount() {
    const numSelected = this.selectionAccount.selected.length;
    const numRows = this.dataSourceAccount.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  //program
  toggleAllRows() {
    if (this.selection.selected.length) {
      this.selection.clear();
      this.showSelectAllButton = false;
      return;
    }

    this.showSelectAllButton = true;
    const startIndex = this.paginator1.pageIndex * this.paginator1.pageSize;
    const endIndex = startIndex + this.paginator1.pageSize;
    const selectedOnPage = this.dataSource.data.slice(startIndex, endIndex);
    if (selectedOnPage.length > 0) {
      this.selection.select(...selectedOnPage);
    }
  }

  //partner
  toggleAllRowsPartner() {
    if (this.selectionPartner.selected.length) {
      this.selectionPartner.clear();
      this.showSelectAllButtonPartner = false;
      return;
    }

    this.showSelectAllButtonPartner = true;
    const startIndex = this.paginator2.pageIndex * this.paginator2.pageSize;
    const endIndex = startIndex + this.paginator2.pageSize;
    const selectedOnPage = this.dataSourcePartner.data.slice(startIndex, endIndex);
    if (selectedOnPage.length > 0) {
      this.selectionPartner.select(...selectedOnPage);
    }
  }

  //account
  toggleAllRowsAccount() {
    if (this.selectionAccount.selected.length) {
      this.selectionAccount.clear();
      this.showSelectAllButtonAccount = false;
      return;
    }

    this.showSelectAllButtonAccount = true;
    const startIndex = this.paginator3.pageIndex * this.paginator3.pageSize;
    const endIndex = startIndex + this.paginator3.pageSize;
    const selectedOnPage = this.dataSourceAccount.data.slice(startIndex, endIndex);
    if (selectedOnPage.length > 0) {
      this.selectionAccount.select(...selectedOnPage);
    }
  }

  ///program
  selectAllProgram() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    if (numSelected === numRows) {
      this.selection.clear();
    } else {
      this.dataSource.filteredData.forEach((row) => this.selection.select(row));
    }
    this.showSelectAllButton = numSelected === numRows;
  }

  //partner
  selectAllPartner() {
    const numSelected = this.selectionPartner.selected.length;
    const numRows = this.dataSourcePartner.filteredData.length;
    if (numSelected === numRows) {
      this.selectionPartner.clear();
    } else {
      this.dataSourcePartner.filteredData.forEach((row) => this.selectionPartner.select(row));
    }
    this.showSelectAllButtonPartner = numSelected === numRows;
  }

  //account
  selectAllAccount() {
    const numSelected = this.selectionAccount.selected.length;
    const numRows = this.dataSourceAccount.filteredData.length;
    if (numSelected === numRows) {
      this.selectionAccount.clear();
    } else {
      this.dataSourceAccount.filteredData.forEach((row) => this.selectionAccount.select(row));
    }
    this.showSelectAllButtonAccount = numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  //program
  checkboxLabel(row?: Program): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.program_id}1`;
  }

  //partner
  checkboxLabelPartner(row?: Partner): string {
    if (!row) {
      return `${this.isAllSelectedPartner() ? 'deselect' : 'select'} all`;
    }

    return `${this.selectionPartner.isSelected(row) ? 'deselect' : 'select'} row ${row.partner_id}1`;
  }

  //account
  checkboxLabelAccount(row?: Accounts): string {
    if (!row) {
      return `${this.isAllSelectedPartner() ? 'deselect' : 'select'} all`;
    }

    return `${this.selectionAccount.isSelected(row) ? 'deselect' : 'select'} row ${row.user_id}1`;
  }

  refreshTable() {
    this.programService.getAllProgramsArchived().subscribe((programs: Program[]) => {
      this.dataSource.data = programs;
    });
  }

  refreshTablePartner() {
    this.partnerService.getAllPartnersArchived().subscribe((partners: Partner[]) => {
      this.dataSourcePartner.data = partners;
    });
  }

  refreshTableAccount() {
    this.accountService.getAllUserArchived().subscribe((accounts: Accounts[]) => {
      this.dataSourceAccount.data = accounts;
    });
  }

  unarchived() {
    const selectedAccounts = this.selection.selected;
    if (selectedAccounts.length) {
      this.programService.unarchive(selectedAccounts).subscribe(
        () => {
          // Success handler
          this.selection.clear();
          const message = 'Programs unarchived successfully';
          const header = 'Success';
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
          this.refreshTable();
        },
        (error) => {
          // Error handler
          console.error('Error unarchived programs', error);
          const message = 'Error unarchived programs';
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
    } else {
      const message = 'Error: something went wrong';
      const header = 'Error';
      const dialogRef = this.dialog.open(ErrorComponent, {
        width: '300px',
        data: {
          header: header,
          message: message
        }
      });
    }
  }

  unarchivedPartner() {
    const selectedPartners = this.selectionPartner.selected;
    if (selectedPartners.length) {
      this.partnerService.unarchive(selectedPartners).subscribe(
        () => {
          // Success handler
          this.selection.clear();
          const message = 'Partner unarchived successfully';
          const header = 'Success';
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
          this.refreshTablePartner();
        },
        (error) => {
          // Error handler
          // console.error('Error unarchived partner', error);
          const message = 'Error unarchived partner';
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
    } else {
      const message = 'Error: something went wrong';
      const header = 'Error';
      const dialogRef = this.dialog.open(ErrorComponent, {
        width: '300px',
        data: {
          header: header,
          message: message
        }
      });
    }
  }

  unarchivedAccount() {
    const selectedAccounts = this.selectionAccount.selected;
    if (selectedAccounts.length) {
      this.accountService.unarchive(selectedAccounts).subscribe(
        () => {
          // Success handler
          this.selection.clear();
          const message = 'Accounts unarchived successfully';
          const header = 'Success';
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
          this.refreshTableAccount();
        },
        (error) => {
          const message = 'Error unarchived account';
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
    } else {
      const message = 'Error: something went wrong';
      const header = 'Error';
      const dialogRef = this.dialog.open(ErrorComponent, {
        width: '300px',
        data: {
          header: header,
          message: message
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }
}
