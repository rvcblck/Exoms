export interface Faculty {
  user_id: string;
  fname: string;
  mname: string | null;
  lname: string;
  suffix: string | null;
  gender: string | null;
  bday: string | null;
  email: string;
  mobile_no: string | null;
  address: string | null;
  status: string;
  archived: number;
  profile_pic: string | null;
  programs: FacultyProgram[];
}

export interface FacultyProgram {
  program_id: string;
  title: string;
  details: string;
  place: string;
  start_date: string;
  end_date: string;
  participant_no: number;
  status: string;
  leader: {
    user_id: string;
    fullname: string;
  };
  members: {
    full_name: string;
    user_id: string;
  }[];
  partners: {
    company_name: string;
    address: string;
    contact_no: string;
    contact_person: string;
    contract: {
      contract_id: string;
      start_date: string;
      end_date: string;
    }[];
    moa_file: string;
  }[];
}
