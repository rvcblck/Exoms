export interface Participant {
  participant_id: string;
  name: string;
  attendance: Attendance[];
}

export interface Attendance {
  attendance_id: string;
  date: string;
  status: string;
}
