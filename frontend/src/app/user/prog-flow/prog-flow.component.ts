import { Component, OnInit } from '@angular/core';
import { ProgramService } from 'src/app/program.service';
import { SelectProgramComponent } from '../modal/select-program/select-program.component';
import { MatDialog } from '@angular/material/dialog';
import { Program, ProgramFlow } from 'src/app/program.model';
// import { DraggableModule } from 'angular-draggable-droppable';
import { DragAndDropModule } from 'angular-draggable-droppable';

@Component({
  selector: 'app-prog-flow',
  templateUrl: './prog-flow.component.html',
  styleUrls: ['./prog-flow.component.css']
})
export class ProgFlowComponent implements OnInit {
  programs!: Program[];
  programFlow!: ProgramFlow[];
  programTitle!: string;

  constructor(private programService: ProgramService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  selectProgram() {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.programService.getUserPrograms(user_id).subscribe(
        (programs) => {
          const dialogRef = this.dialog.open(SelectProgramComponent, {
            data: { programs: programs },
            maxWidth: '90%',
            minWidth: '60%'
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.programTitle = result.title;

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
  onDragEnd(draggedFlow: ProgramFlow) {
    // Update the arrangement property of the dragged row
    // and save the changes to the database
    // ...
  }

  onDrop(event: any) {
    // Update the arrangement property of the dropped row
    // and save the changes to the database
    // ...
  }
}
