export interface Accounts {
  user_id: string;
  fname: string;
  mname: string | null;
  lname: string;
  suffix: string | null;
  email: string;
  mobile_no: string | null;
  // address: string | null;
  status: string;
  // archived: number;
  // programs: Program[];
  previous: number;
  ongoing: number;
  upcoming: number;
  total: number;
  // profile_pic: string | null;
}

export interface ViewAccount {
  user_id: string;
  fname: string;
  mname: string | null;
  lname: string;
  suffix: string;
  gender: string;
  bday: string;
  email: string;
  mobile_no: string;
  address: string;
  status: string;
  profile_pic: string;
  previous: number;
  ongoing: number;
  upcoming: number;
  programs_previous: ProgramPrevious[];
  programs_ongoing: ProgramOngoing[];
  programs_upcoming: ProgramUpcoming[];
}

export interface ProgramPrevious {
  program_id: string;
  title: string;
  start_date: string;
  end_date: string;
  leader: number | null;
}

export interface ProgramOngoing {
  program_id: string;
  title: string;
  start_date: string;
  end_date: string;
  leader: number | null;
}

export interface ProgramUpcoming {
  program_id: string;
  title: string;
  start_date: string;
  end_date: string;
  leader: number | null;
}
