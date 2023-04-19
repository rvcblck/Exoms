export interface Leader {
  user_id: string;
  fullName: string;
}

export interface Program {
  program_id: string;
  title: string;
  details: string;
  place: string;
  start_date: string;
  end_date: string;
  leader: Leader;
  participant_count: number;
  status: string;
}

// for view program

export interface ViewLeader {
  user_id: string;
  fullName: string;
}

export interface ViewMember {
  user_id: string;
  fullName: string;
}

export interface ViewContract {
  contract_id: string;
  start_date: string;
  end_date: string;
}

export interface ViewPartner {
  partner_id: string;
  name: string;
  address: string;
  contact_no: string;
  contact_person: string;
  moa_file: string;
  contract: ViewContract[];
}

export interface ViewParticipant {
  participant_id: string;
  name: string;
}

export interface ViewProgram {
  program_id: string;
  title: string;
  details: string;
  place: string;
  start_date: string;
  end_date: string;
  status: string;
  certificate: any;
  invitation: any;
  leader: ViewLeader;
  members: ViewMember[];
  partners: ViewPartner[];
  participants: ViewParticipant[];
  participant_count: number;
}

//AutoComplete

export interface AutoComplete {
  users: AC_Users[];
  partners: Ac_Partners[];
}

export interface AC_Users {
  user_id: string;
  fname: string;
  lname: string;
  mname: string;
  suffix: string;
  ongoing: number;
  upcoming: number;
}

export interface Ac_Partners {
  partner_id: string;
  name: string;
}
