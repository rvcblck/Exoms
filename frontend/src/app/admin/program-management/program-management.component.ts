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

  isSearchActive = true;
  datePipe: any;

  constructor(
    private programService: ProgramService,
    private dialog: MatDialog,
    private partnerService: PartnerService,
    private accountService: AccountService,
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.adminLayout.pageTitle = 'Program Management';
    // this.cdr.detectChanges();
    this.getPrograms();
  }

  getPrograms(): void {
    this.programService.getPrograms().subscribe(
      (programs) => {
        this.programs = programs;
        console.log('Programs retrieved successfully');
      },
      (error) => {
        console.error('Error retrieving programs:', error);
      }
    );
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
    this.programService.getAutoComplete().subscribe(
      (autocomplete) => {
        const dialogRef = this.dialog.open(CreateProgramComponent, {
          data: { autocomplete: autocomplete },
          maxWidth: '90%',
          minWidth: '60%'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  viewProgram(user_id: string) {
    this.programService.getProgramInfo(user_id).subscribe(
      (program) => {
        // console.log(program);
        const dialogRef = this.dialog.open(ViewProgramComponent, {
          data: { program: program },
          maxWidth: '90%',
          minWidth: '60%',
          maxHeight: '80vh'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
