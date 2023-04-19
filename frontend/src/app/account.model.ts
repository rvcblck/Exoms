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
  previous: number;
  ongoing: number;
  upcoming: number;
  programs: Program[];
}

export interface Program {
  program_id: string;
  title: string;
  leader: number | null;
}
