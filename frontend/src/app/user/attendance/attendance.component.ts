import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attendance, Participant } from 'src/app/attendance.model';
import { ProgramService } from 'src/app/program.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  dates: string[] = [];
  attendanceIds: string[] = [];
  showAddDateForm = false;
  newDate: string = '';
  showAddButton = true;

  constructor(
    public dialogRef: MatDialogRef<AttendanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { attendance: Participant[] },
    private programService: ProgramService
  ) {}

  ngOnInit(): void {
    this.data.attendance.forEach((participant) => {
      participant.attendance.forEach((att) => {
        if (!this.dates.includes(att.date)) {
          this.dates.push(att.date);
        }
      });
    });
    this.attendanceIds = ['name', ...this.dates, 'add'];
  }

  addDate() {
    if (this.newDate && !this.dates.includes(this.newDate)) {
      this.dates.push(this.newDate);
      this.attendanceIds = ['name', ...this.dates, 'add'];
      this.showAddDateForm = false;
      this.newDate = '';
      this.showAddButton = true; // add this line to set showAddButton to true
    }
  }

  isAttendanceChecked(participant: Participant, date: string): boolean {
    const attendance = participant.attendance.find((att) => att.date === date);
    return !!attendance && attendance.status === 'present';
  }

  toggleAttendance(participant: Participant, date: string): void {
    const attendance = participant.attendance.find((att) => att.date === date);
    if (attendance) {
      attendance.status = attendance.status === 'present' ? 'absent' : 'present';
    } else {
      participant.attendance.push({ attendance_id: '', date, status: 'present' });
    }
  }

  onSave() {
    const participantAttendance = [];

    // Iterate through each participant
    for (const participant of this.data.attendance) {
      const participantId = participant.participant_id;
      const participantDates = [];

      // Iterate through each attendance record for this participant
      for (const date of this.dates) {
        const attendance = participant.attendance.find((att) => att.date === date);
        const status = attendance ? attendance.status : 'absent';
        participantDates.push({ date, status });
      }

      // Add this participant's attendance data to the array
      participantAttendance.push({
        participant_id: participantId,
        dates: participantDates
      });
    }

    console.log(participantAttendance);

    this.programService.storeAttendance(participantAttendance).subscribe(
      (program) => {
        console.log('Program created successfully:', program);
        // TODO: Handle success
      },
      (error) => {
        console.error('Error creating program:', error);
        // TODO: Handle error
      }
    );
  }
}

// Do something with the attendance data, such as sending
