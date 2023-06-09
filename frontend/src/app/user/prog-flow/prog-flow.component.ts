import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ProgramService } from 'src/app/program.service';
import { SelectProgramComponent } from '../modal/select-program/select-program.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OtherDetails, Program, ProgramFlow, ProgramTopic, ProgramPosition } from 'src/app/program.model';
// import { DraggableModule } from 'angular-draggable-droppable';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DragEndEvent } from 'angular-draggable-droppable';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SuccessComponent } from 'src/app/dialog/success/success.component';
import { CreateAccountComponent } from 'src/app/admin/modal/create-account/create-account.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';
import { environment } from 'src/environments/environment';
import { TitleService } from 'src/app/title.service';

export interface User {
  name: string;
}

@Component({
  selector: 'app-prog-flow',
  templateUrl: './prog-flow.component.html',
  styleUrls: ['./prog-flow.component.css']
})
export class ProgFlowComponent implements OnInit {
  programs!: Program[];
  programFlow!: OtherDetails;
  programTitle!: string;
  program_id!: string;
  flowForm: FormGroup = new FormGroup({});
  topicForm: FormGroup = new FormGroup({});
  // positionForm: FormGroup = new FormGroup({});
  submitted = false;
  topic_submitted = false;
  position_submitted = false;
  inputPositionEmpty = false;
  userStatus = false;
  assetPath = environment.assetPath;

  positionControl!: FormControl[];

  positionOptions = ['technical', 'moderator', 'speaker', 'invitation/report'];

  @ViewChild('progFlowTitle') progFlowTitleInput!: ElementRef;
  @ViewChild('progFlowDesc') progFlowDescInput!: ElementRef;

  constructor(
    private programService: ProgramService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private titleService: TitleService
  ) {
    this.flowForm = this.formBuilder.group({
      flowTitle: ['', Validators.required],
      flowDesc: ['', Validators.required]
    });

    this.topicForm = this.formBuilder.group({
      col_1: ['', Validators.required],
      col_2: ['', Validators.required],
      col_3: ['', Validators.required]
    });

    // this.positionForm = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   position: ['', Validators.required]
    // });
  }

  ngOnInit(): void {
    const pageTitle = 'Program Flow';
    this.titleService.titleChange.emit(pageTitle);
    // this.cdr.detectChanges();

    const userStatus = localStorage.getItem('status');
    if (userStatus == 'approve') {
      this.userStatus = true;
    }
  }

  selectProgram() {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.programService.getUserPrograms(user_id).subscribe(
        (programs) => {
          const dialogRef = this.dialog.open(SelectProgramComponent, {
            data: { programs: programs },
            maxWidth: '100%',
            minWidth: '60%'
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.programTitle = result.title;
              this.program_id = result.program_id;

              this.programService.getProgramFlow(result.program_id).subscribe(
                (programs) => {
                  this.programFlow = programs;

                  this.positionControl = this.programFlow.position.map((position) => new FormControl(position.position));
                },
                (error) => {}
              );
            }
          });
        },
        (error) => {}
      );
    }
  }
  //
  //
  //
  //
  //
  //
  //
  //
  // Flow Page
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.programFlow.flow, event.previousIndex, event.currentIndex);

    // update the arrangement property based on new position
  }

  capitalizeWords(value: string): string {
    if (value) {
      return value.replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      return value;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.flowForm.invalid) {
      return;
    }
    //get input value and add to this.programFlow with the same arrangement
    const flowTitle = this.flowForm.get('flowTitle')?.value;
    const flowDesc = this.flowForm.get('flowDesc')?.value;

    const newFlow: ProgramFlow = {
      flow: flowTitle,
      description: flowDesc
    };

    this.programFlow.flow.push(newFlow);
    this.flowForm.reset();
    this.submitted = false;
  }

  updateFlow() {
    const flow = {
      program_id: this.program_id,
      data: this.programFlow.flow
    };
    // if (this.programFlow.length) {
    this.programService.updateProgramFlow(flow).subscribe(
      (programs) => {
        const message = 'Update Successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      },
      (error) => {
        const message = 'Error Updating program';
        const header = 'Error';
        const dialogRef = this.dialog.open(ErrorComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      }
    );
    // }
  }

  removeItem(flow: any) {
    // iwant to remove the item here
    const index = this.programFlow.flow.indexOf(flow);
    if (index > -1) {
      this.programFlow.flow.splice(index, 1);
    }
  }
  //
  //
  //
  //
  //
  //
  //
  //
  // Topic Page

  dropTopic(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.programFlow.topic, event.previousIndex, event.currentIndex);

    // update the arrangement property based on new position
  }

  onTopicSubmit(): void {
    this.topic_submitted = true;
    if (this.topicForm.invalid) {
      return;
    }
    //get input value and add to this.programFlow with the same arrangement
    const col_1 = this.topicForm.get('col_1')?.value;
    const col_2 = this.topicForm.get('col_2')?.value;
    const col_3 = this.topicForm.get('col_3')?.value;

    const newTopic: ProgramTopic = {
      col_1: col_1,
      col_2: col_2,
      col_3: col_3
    };

    this.programFlow.topic.push(newTopic);
    this.topicForm.reset();
    this.submitted = false;
  }

  updateTopic() {
    const topic = {
      program_id: this.program_id,
      data: this.programFlow.topic
    };
    this.programService.updateProgramTopic(topic).subscribe(
      (programs) => {
        // this.dialogRef.close();
        const message = 'Update Successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      },
      (error) => {
        const message = 'Error Updating program';
        const header = 'Error';
        const dialogRef = this.dialog.open(ErrorComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      }
    );
    // }
  }

  removeTopicItem(topic: any) {
    const index = this.programFlow.topic.indexOf(topic);
    if (index > -1) {
      this.programFlow.topic.splice(index, 1);
    }
  }
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // Position Tab
  displayPosition(position: string): string {
    return position ? position : '';
  }

  dropPosition(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.programFlow.position, event.previousIndex, event.currentIndex);
    moveItemInArray(this.positionControl, event.previousIndex, event.currentIndex);
  }

  updatePosition() {
    this.position_submitted = true;
    if (this.positionControl.some((control) => !control.value)) {
      this.inputPositionEmpty = true;
      return; // return if any of the controls is empty
    }

    const positions = [];

    for (let i = 0; i < this.positionControl.length; i++) {
      const position = this.positionControl[i].value;
      positions.push(position);
    }

    const updatedMembers = [];

    for (let i = 0; i < this.programFlow.position.length; i++) {
      const member = this.programFlow.position[i];
      const position = positions[i];

      if (position) {
        const updatedMember = Object.assign({}, member, { position: position });
        updatedMembers.push(updatedMember);
      } else {
        updatedMembers.push(member);
      }
    }

    const position = {
      program_id: this.program_id,
      data: updatedMembers
    };
    this.programService.updateProgramPosition(position).subscribe(
      (programs) => {
        const message = 'Update Successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      },
      (error) => {
        const message = 'Error Updating program';
        const header = 'Error';
        const dialogRef = this.dialog.open(ErrorComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      }
    );
  }
}
