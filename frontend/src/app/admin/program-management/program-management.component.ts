import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProgramService } from 'src/app/program.service';
import { Program } from 'src/app/program.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateProgramComponent } from '../modal/create-program/create-program.component';
import { ViewProgramComponent } from '../modal/view-program/view-program.component';
import { Profile } from 'src/app/profile.model';
import { forkJoin } from 'rxjs';
import { PartnerService } from 'src/app/partner.service';
import { Accounts } from 'src/app/account.model';
import { AccountService } from 'src/app/account.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { AuthService } from 'src/app/auth.service';
import { AttendanceComponent } from 'src/app/user/attendance/attendance.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-program-management',
  templateUrl: './program-management.component.html',
  styleUrls: ['./program-management.component.css']
})
export class ProgramManagementComponent implements OnInit {
  programs!: Program[];
  // users!: User[];
  searchText = '';
  searchPlace: string = '';
  selectedStatus = '';
  selectedSort: 'title' | 'latest' | 'oldest' | 'status' = 'title';
  statuses = ['Previous', 'Upcoming', 'Ongoing'];
  minStartDate: Date | undefined;
  maxEndDate: Date | undefined;
  pageName = 'Program Management';
  loadDialog = false;
  assetPath = environment.assetPath;
  userStatus = false;

  isSearchActive = true;
  datePipe: any;

  constructor(
    private programService: ProgramService,
    private dialog: MatDialog,
    private partnerService: PartnerService,
    private accountService: AccountService,
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userStatus = localStorage.getItem('status');
    if (userStatus == 'approve') {
      this.userStatus = true;
    }

    const isAdmin = this.authService.isAdmin();
    this.getPrograms();
  }

  resetFilter() {
    this.searchText = '';
    this.minStartDate = undefined;
    this.maxEndDate = undefined;
  }

  getPrograms(): void {
    if (this.isAdmin()) {
      this.programService.getPrograms().subscribe(
        (programs) => {
          this.programs = programs;
        },
        (error) => {}
      );
    } else {
      const user_id = localStorage.getItem('user_id');
      if (user_id) {
        this.programService.getUserPrograms(user_id).subscribe(
          (programs) => {
            this.programs = programs;
          },
          (error) => {}
        );
      }
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  collapseSearch() {
    const checkbox = document.getElementById('search-toggle') as HTMLInputElement;
    checkbox.checked = false;
  }

  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(dateString, 'yyyy-MM-dd');
    return formattedDate;
  }

  filteredPrograms() {
    if (!this.programs || !Array.isArray(this.programs)) {
      return [];
    }
    return this.programs.filter(
      (program) =>
        (program.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          program.place.toLowerCase().includes(this.searchText.toLowerCase())) &&
        program.status.includes(this.selectedStatus) &&
        (!this.minStartDate || new Date(program.start_date) >= new Date(this.minStartDate)) &&
        (!this.maxEndDate || new Date(program.end_date) <= new Date(this.maxEndDate))
    );
  }

  addProgram() {
    this.loadDialog = true;
    this.programService.getAutoComplete().subscribe(
      (autocomplete) => {
        this.loadDialog = false;
        const dialogRef = this.dialog.open(CreateProgramComponent, {
          data: { autocomplete: autocomplete },
          maxWidth: '90%',
          minWidth: '60%'
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.getPrograms();
          }
        });
      },
      (error) => {
        this.loadDialog = false;
      }
    );
  }

  viewProgram(user_id: string) {
    this.loadDialog = true;
    this.programService.getProgramInfo(user_id).subscribe(
      (program) => {
        this.loadDialog = false;
        const dialogRef = this.dialog.open(ViewProgramComponent, {
          data: { program: program },
          maxWidth: '90%',
          minWidth: '60%',
          maxHeight: '80vh'
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.getPrograms();
          }
        });
      },
      (error) => {}
    );
  }

  onAttendanceClick(event: Event, programId: string) {
    // program_id.stopPropagation();
    event.stopPropagation();
    this.programService.getAttendance(programId).subscribe(
      (attendance) => {
        const dialogRef = this.dialog.open(AttendanceComponent, {
          data: { attendance: attendance },
          minWidth: '50%',
          maxWidth: '90%'
        });
      },
      (error) => {}
    );
  }
}
