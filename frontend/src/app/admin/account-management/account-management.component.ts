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
import { TitleService } from 'src/app/title.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {
  // displayedColumns: string[] = ['select', 'fname', 'email', 'mobile_no', 'status','previous','ongoing','upcoming','action'];
  displayedColumns: string[] = ['previous', 'ongoing', 'upcoming'];
  dataSource = new MatTableDataSource<Accounts>();
  selection = new SelectionModel<Accounts>(true, []);
  dataToCall: string[] = ['select', 'fname', 'email', 'mobile_no', 'status', 'previous', 'ongoing', 'upcoming', 'total', 'action'];
  showSelectAllButton = false;
  loading = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private titleService: TitleService
  ) {}

  ngOnInit() {
    const pageTitle = 'Account Management';
    this.titleService.titleChange.emit(pageTitle);
    this.cdr.detectChanges();
    this.getAccounts();
  }

  getAccounts() {
    this.loading = true;
    this.accountService.getAccounts().subscribe((accounts) => {
      this.dataSource.data = accounts;
      this.loading = false;
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.dataSource.sort = this.sort));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.selection.selected.length) {
      this.selection.clear();
      this.showSelectAllButton = false;
      return;
    }

    this.showSelectAllButton = true;
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    const selectedOnPage = this.dataSource.data.slice(startIndex, endIndex);
    if (selectedOnPage.length > 0) {
      this.selection.select(...selectedOnPage);
    }
  }

  selectAllAccount() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    if (numSelected === numRows) {
      this.selection.clear();
    } else {
      this.dataSource.filteredData.forEach((row) => this.selection.select(row));
    }
    this.showSelectAllButton = numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Accounts): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.user_id}1`;
  }

  approveUser() {
    const selectedAccounts = this.selection.selected;

    if (selectedAccounts.length) {
      this.accountService.approveUser(selectedAccounts).subscribe(
        () => {
          // Success handler
          this.selection.clear();
          const message = 'Accounts approved successfully';
          const header = 'Success';
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
          this.getAccounts();
        },
        (error) => {
          // Error handler
          const message = 'Error approving accounts';
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

  disapproveUser() {
    const selectedAccounts = this.selection.selected;

    if (selectedAccounts.length) {
      this.accountService.disapproveUser(selectedAccounts).subscribe(
        () => {
          // Success handler
          this.selection.clear();
          const message = 'Accounts disapproved successfully';
          const header = 'Success';
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
          this.getAccounts();
        },
        (error) => {
          // Error handler
          console.error('Error disapproving accounts', error);
          const message = 'Error disapproving accounts';
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

  viewAccount(user_id: string) {
    this.loading = true;
    this.accountService.getAccountInfo(user_id).subscribe(
      (account) => {
        this.loading = false;
        const dialogRef = this.dialog.open(AccountInfoComponent, {
          data: { account: account },
          maxWidth: '90%',
          minWidth: '60%'
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.getAccounts();
          }
        });
      },
      (error) => {
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
    );
  }

  createAccount() {
    const dialogRef = this.dialog.open(CreateAccountComponent, {
      maxWidth: '90%',
      minWidth: '40%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAccounts();
      }
    });
  }
}
