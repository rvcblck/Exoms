import { Component, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/program.service';
import { Program } from 'src/app/program.model';
import { MatDialog } from '@angular/material/dialog';
import { Profile } from 'src/app/profile.model';
import { forkJoin } from 'rxjs';
import { PartnerService } from 'src/app/partner.service';
import { Accounts } from 'src/app/account.model';
import { AccountService } from 'src/app/account.service';
import { Faculty } from 'src/app/faculty.model';
import { FacultyProgram } from 'src/app/faculty.model';
import { ViewProgramComponent } from 'src/app/admin/modal/view-program/view-program.component';
import { AttendanceComponent } from '../attendance/attendance.component';

@Component({
  selector: 'app-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.css']
})
export class ExtensionComponent implements OnInit {
  programs!: Program[];
  // users!: User[];
  searchText = '';
  searchPlace: string = '';
  selectedStatus = '';
  selectedSort: 'title' | 'latest' | 'oldest' | 'status' = 'title';
  statuses = ['Previous', 'Upcoming', 'Ongoing'];
  minStartDate: Date | undefined;
  maxEndDate: Date | undefined;

  constructor(
    private programService: ProgramService,
    private dialog: MatDialog,
    private partnerService: PartnerService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // this.getPrograms();
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.programService.getUserPrograms(user_id).subscribe(
        (programs) => {
          this.programs = programs;
          // console.log(this.programs);

          console.log('Programs retrieved successfully');
        },
        (error) => {
          console.error('Error retrieving programs:', error);
        }
      );
    }
  }

  getPrograms(): void {}

  filteredPrograms() {
    if (!this.programs || !Array.isArray(this.programs)) {
      console.log(this.programs, 'data not showing');
      return [];
    }
    return this.programs.filter(
      (programs) =>
        (programs.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          programs.place.toLowerCase().includes(this.searchText.toLowerCase())) &&
        programs.status.includes(this.selectedStatus) &&
        (!this.minStartDate || new Date(programs.start_date) >= this.minStartDate) &&
        (!this.maxEndDate || new Date(programs.end_date) <= this.maxEndDate)
    );
  }

  viewProgram(program_id: string) {
    this.programService.getProgramInfo(program_id).subscribe(
      (program) => {
        // console.log(program);
        const dialogRef = this.dialog.open(ViewProgramComponent, {
          data: { program: program },
          width: '500px'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  onAttendanceClick(event: Event, programId: string) {
    // program_id.stopPropagation();
    event.stopPropagation();
    this.programService.getAttendance(programId).subscribe(
      (attendance) => {
        const dialogRef = this.dialog.open(AttendanceComponent, {
          data: { attendance: attendance },
          width: '80%'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
