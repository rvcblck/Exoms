import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Program } from 'src/app/program.model';

@Component({
  selector: 'app-select-program',
  templateUrl: './select-program.component.html',
  styleUrls: ['./select-program.component.css']
})
export class SelectProgramComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SelectProgramComponent>, @Inject(MAT_DIALOG_DATA) public data: { programs: Program[][] }) {}

  @ViewChild(MatSort)
  sort!: MatSort;

  dataSource = new MatTableDataSource<Program[]>();
  displayedColumns: string[] = ['title', 'date', 'place', 'action'];

  ngOnInit(): void {
    // console.log(this.data.programs);
    this.dataSource.data = this.data.programs;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  // onClose(): void {
  //   const data = {
  //     program_id: this.dataSource.program_id,
  //     title: this.dataSource.title
  //   };
  //   this.dialogRef.close(data);
  // }
}
