import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// import { Program } from 'src/app/program.model';
import { Profile } from 'src/app/profile.model';
import { ViewProgram } from 'src/app/program.model';
import { ProgramService } from 'src/app/program.service';
import { CreateProgramComponent } from '../create-program/create-program.component';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-view-program',
  templateUrl: './view-program.component.html',
  styleUrls: ['./view-program.component.css']
})
export class ViewProgramComponent implements OnInit {
  program: ViewProgram[] = [];
  users!: Profile;
  previousCount: number = 0;
  ongoingCount: number = 0;
  upcomingCount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ViewProgramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { program: ViewProgram },
    private programService: ProgramService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.data.program);
    // console.log(this.data.users);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editProgram(program_id: string) {
    this.dialogRef.close();

    forkJoin([
      this.programService.getProgramInfo(program_id),
      this.programService.getAutoComplete()
    ]).subscribe(
      ([program, autocomplete]) => {
        const dialogRef = this.dialog.open(CreateProgramComponent, {
          data: { program: program, autocomplete: autocomplete },
          maxWidth: '90%',
          minWidth: '40%'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
