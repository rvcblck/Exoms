import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { ProgramService } from 'src/app/program.service';
import { SelectProgramComponent } from 'src/app/user/modal/select-program/select-program.component';
import { MatDialog } from '@angular/material/dialog';
import { Program, ViewProgram } from 'src/app/program.model';
import { OtherDetails } from 'src/app/program.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

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
  currentDate: any;

  inputWidth!: string;
  inputValue!: string;

  adminName: any;
  adminRole: any;

  constructor(
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private programService: ProgramService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // this.adminLayout.pageTitle = 'Reports';
    // this.cdr.detectChanges();\
    if (this.inputValue) {
      this.inputWidth = this.inputValue.length * 8 + 'px';
    }

    console.log(this.inputValue);
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

            this.adminName = localStorage.getItem('fullName');
            this.adminRole = localStorage.getItem('role');
            const currentDate = new Date();
            if (currentDate) {
              this.currentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
            }

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

  downloadPDF() {
    const table1 = document.getElementById('programFlow');
    const table2 = document.getElementById('programTopic');
    if (table1 && table2) {
      // Check if both tables are defined and not null
      html2canvas(table1).then((canvas1) => {
        html2canvas(table2).then((canvas2) => {
          const imgWidth = 208;
          const imgHeight = (canvas1.height * imgWidth) / canvas1.width;
          const contentDataURL1 = canvas1.toDataURL('image/png');
          const contentDataURL2 = canvas2.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
          const position = 0;
          pdf.addImage(contentDataURL1, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.addPage(); // Add a second page
          pdf.addImage(contentDataURL2, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.save('MYPdf.pdf'); // Generated PDF
        });
      });
    }
  }

  calculateWidth(): number {
    if(this.inputValue){
      return (this.inputValue.length + 1) * 8;
    }
    return 100
    // adjust the multiplier to your preference
  }

}
