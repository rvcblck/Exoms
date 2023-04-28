import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { ProgramService } from 'src/app/program.service';
import { SelectProgramComponent } from 'src/app/user/modal/select-program/select-program.component';
import { MatDialog } from '@angular/material/dialog';
import { Program, ViewProgram } from 'src/app/program.model';
import { OtherDetails } from 'src/app/program.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  program!: ViewProgram;
  programFlow!: OtherDetails;
  programTitle!: string;
  program_id!: string;
  content: any;

  constructor(
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private programService: ProgramService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.adminLayout.pageTitle = 'Reports';
    // this.cdr.detectChanges();
  }

  selectProgram() {
    this.programService.getPrograms().subscribe(
      (programs) => {
        const dialogRef = this.dialog.open(SelectProgramComponent, {
          data: { programs: programs },
          maxWidth: '90%',
          minWidth: '60%'
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.programTitle = result.title;
            this.program_id = result.program_id;

            this.programService.getProgramInfo(result.program_id).subscribe(
              (program) => {
                this.program = program;
                console.log(this.program);
              },
              (error) => {
                console.error('Error retrieving programs:', error);
              }
            );

            this.programService.getProgramFlow(result.program_id).subscribe(
              (programs) => {
                this.programFlow = programs;

                console.log(this.programFlow);
              },
              (error) => {
                console.error('Error retrieving programs:', error);
              }
            );
          }
        });
      },
      (error) => {
        console.error('Error retrieving programs:', error);
      }
    );
  }
}
