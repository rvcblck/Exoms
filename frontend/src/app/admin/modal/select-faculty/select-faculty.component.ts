import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Accounts, SelectAccount } from 'src/app/account.model';

@Component({
  selector: 'app-select-faculty',
  templateUrl: './select-faculty.component.html',
  styleUrls: ['./select-faculty.component.css']
})
export class SelectFacultyComponent {
  constructor(public dialogRef: MatDialogRef<SelectFacultyComponent>, @Inject(MAT_DIALOG_DATA) public data: { accounts: SelectAccount[][] }) {}

  @ViewChild(MatSort)
  sort!: MatSort;
  selection = new SelectionModel<SelectAccount>(true, []);

  dataSource = new MatTableDataSource<SelectAccount[]>();
  displayedColumns: string[] = ['faculty_name', 'action'];

  ngOnInit(): void {
    this.dataSource.data = this.data.accounts;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => (this.dataSource.sort = this.sort));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
