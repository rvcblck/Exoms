import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { ProgramService } from 'src/app/program.service';
import { SelectProgramComponent } from 'src/app/user/modal/select-program/select-program.component';
import { MatDialog } from '@angular/material/dialog';
import { Program, ViewProgram } from 'src/app/program.model';
import { OtherDetails } from 'src/app/program.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Partner } from 'src/app/partner.model';
import { PartnerService } from 'src/app/partner.service';
import autoTable from 'jspdf-autotable';
// import { Program } from 'src/app/program.model';

// import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SelectFacultyComponent } from '../modal/select-faculty/select-faculty.component';
import { Accounts, SelectAccount } from 'src/app/account.model';
import { AccountService } from 'src/app/account.service';
// import { jsPDFHookData } from 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  program!: ViewProgram;
  userAccounts!: SelectAccount[];
  userPrograms!: Program;
  programFlow!: OtherDetails;
  programTitle!: string;
  program_id!: string;
  user_id!: string;
  content: any;
  currentDate: any;

  inputWidth!: string;
  inputValue!: string;

  adminName: any;
  adminRole: any;
  allPartners: any;
  facultyName!: string;

  activeContracts!: any[];
  expiredContracts!: any[];

  @ViewChild('sort') sort!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;

  dataSource = new MatTableDataSource<Partner>();
  displayedColumns: string[] = ['company_name', 'address', 'contact_no', 'contract_dates'];

  facultyDataSource = new MatTableDataSource<Program>();
  facultyDisplayedColumns: string[] = ['title', 'place', 'start_date', 'end_date', 'status'];

  constructor(
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private programService: ProgramService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private partnerService: PartnerService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // this.adminLayout.pageTitle = 'Reports';
    // this.cdr.detectChanges();\
    if (this.inputValue) {
      this.inputWidth = this.inputValue.length * 8 + 'px';
    }

    this.partnerService.getAllPartners().subscribe((partners) => {
      this.dataSource.data = partners;
    });

    this.partnerService.getAllPartners().subscribe((partners) => {
      this.dataSource.data = partners;
      this.allPartners = partners;
      this.activeContracts = partners.filter((partner) => {
        const endDate = new Date(partner.contracts.end_date);
        return endDate > new Date();
      });
      this.expiredContracts = partners.filter((partner) => {
        const endDate = new Date(partner.contracts.end_date);
        return endDate <= new Date();
      });
    });

    this.adminName = localStorage.getItem('fullName');
    this.adminRole = localStorage.getItem('role');
    const currentDate = new Date();
    if (currentDate) {
      this.currentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    }

    console.log(this.facultyDataSource.sort, this.sort2);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.dataSource.sort = this.sort));
    this.dataSource.sort = this.sort;

    this.facultyDataSource.sort = this.sort2;
    this.sort2.sortChange.subscribe(() => (this.facultyDataSource.sort = this.sort2));

    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'contract_dates':
          return item.contracts.start_date;
        default:
          return item[property];
      }
    };
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

            // this.adminName = localStorage.getItem('fullName');
            // this.adminRole = localStorage.getItem('role');
            // const currentDate = new Date();
            // if (currentDate) {
            //   this.currentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
            // }

            this.programService.getProgramInfo(result.program_id).subscribe(
              (program) => {
                this.program = program;
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
    if (this.inputValue) {
      return (this.inputValue.length + 1) * 8;
    }
    return 100;
    // adjust the multiplier to your preference
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    if (filterValue === 'active') {
      this.dataSource.data = this.activeContracts;
    } else if (filterValue === 'expired') {
      this.dataSource.data = this.expiredContracts;
    } else {
      this.dataSource.data = this.allPartners;
    }
  }

  downloadPartnerPDF() {
    const doc = new jsPDF();
    const table = document.getElementById('partner_table');
    const rows = [];
    const adminName = this.adminName;
    const currentDate = this.currentDate;
    const role = this.adminRole;
    const totalPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add header row
    const headerRow = [];
    for (const column of this.displayedColumns) {
      if (column === 'company_name') {
        headerRow.push('Partner Name');
      } else {
        headerRow.push(column.charAt(0).toUpperCase() + column.slice(1));
      }
    }
    rows.push(headerRow);

    // Add data rows
    for (const data of this.dataSource.data) {
      const row = [];
      for (const column of this.displayedColumns) {
        let value = data[column];
        if (column === 'contract_dates') {
          value = this.formatDate(data.contracts.start_date) + ' - ' + this.formatDate(data.contracts.end_date);
        }
        row.push(value);
      }
      rows.push(row);
    }

    // Generate table in PDF
    const tableOptions = {
      head: rows.slice(0, 1),
      body: rows.slice(1),
      margin: { top: 50 }, // set margin top of the table
      didDrawPage: function (data: { pageNumber: number }) {
        // add image to the top of every page
        doc.addImage('../../assets/images/pdf-logo.png', 'PNG', 10, 10, doc.internal.pageSize.getWidth() - 20, 40);
        // doc.setFontStyle('bold');

        doc.setFontSize(9);
        doc.text('Printed by: ', 14, doc.internal.pageSize.getHeight() - 10);
        doc.text(adminName + '  |  ' + role, 30, doc.internal.pageSize.getHeight() - 10);
        doc.text(currentDate, doc.internal.pageSize.getWidth() - 35, doc.internal.pageSize.getHeight() - 10);
        doc.text('Page ' + data.pageNumber, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        // for (let i = 1; i <= totalPages; i++) {
        //   doc.setPage(i);
        //   doc.text('Page ' + i + '/' + totalPages, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        // }

        // doc.setPage(1);
        // doc.text('Page ' + data.pageNumber + '/' + totalPages, pageWidth / 2, doc.internal.pageSize.getHeight() - 14, { align: 'center' });
      }
    };

    // Create table using autoTable
    autoTable(doc, tableOptions);

    // Save PDF
    doc.save('partners.pdf');
  }

  downloadFacultyPDF() {
    const doc = new jsPDF();
    const table = document.getElementById('faculty_table');
    const rows = [];
    const FacultyName = this.facultyName;
    const adminName = this.adminName;
    const currentDate = this.currentDate;
    const role = this.adminRole;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add header row
    const headerRow = [];
    for (const column of this.facultyDisplayedColumns) {
      headerRow.push(column.charAt(0).toUpperCase() + column.slice(1));
    }
    rows.push(headerRow);

    // Add data rows
    for (const data of this.facultyDataSource.data) {
      const row = [];
      for (const column of this.facultyDisplayedColumns) {
        let value = data[column];
        if (column === 'start_date' || column === 'end_date') {
          value = this.formatDate(value);
        }
        row.push(value);
      }
      rows.push(row);
    }

    const tableOptions = {
      head: rows.slice(0, 1),
      body: rows.slice(1),
      margin: { top: 70 }, // set margin top of the table
      didDrawPage: function (data: { pageNumber: number }) {
        // add image to the top of every page
        doc.addImage('../../assets/images/pdf-logo.png', 'PNG', 10, 10, doc.internal.pageSize.getWidth() - 20, 40);
        // doc.setFontStyle('bold');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Faculty Name: ', 10, 60); // Add "Faculty Name:" text
        doc.setFont('helvetica', 'normal');
        doc.text(FacultyName, 40, 60); // Add bolded faculty name

        doc.setFontSize(9);
        doc.text('Printed by: ', 14, doc.internal.pageSize.getHeight() - 10);
        doc.text(adminName + '  |  ' + role, 30, doc.internal.pageSize.getHeight() - 10);
        doc.text(currentDate, doc.internal.pageSize.getWidth() - 35, doc.internal.pageSize.getHeight() - 10);
        doc.text('Page ' + data.pageNumber, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        // doc.text('Page ' + data.pageNumber + '/' + totalPages, pageWidth / 2, doc.internal.pageSize.getHeight() - 14, { align: 'center' });
      }
    };

    // Create table using autoTable
    autoTable(doc, tableOptions);

    // Save PDF
    doc.save('faculty.pdf');
  }

  selectFaculty() {
    this.accountService.getSelectAccounts().subscribe(
      (accounts) => {
        this.userAccounts = accounts;

        const dialogRef = this.dialog.open(SelectFacultyComponent, {
          data: { accounts: accounts },
          maxWidth: '90%',
          minWidth: '30%',
          height: '70vh'
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // this.programTitle = result.title;
            this.facultyName = result.lname + ', ' + result.fname;
            this.user_id = result.user_id;

            this.programService.getUserPrograms(result.user_id).subscribe(
              (programs) => {
                this.facultyDataSource.data = programs;
                this.facultyDataSource.sort = this.sort2;

                // console.log(this.dataSource, this.sort, 'eto sa partner');
                // console.log(this.facultyDataSource, this.sort2, 'eto sa faculty');

                console.log('Programs retrieved successfully');
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
