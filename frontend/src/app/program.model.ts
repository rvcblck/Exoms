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

export interface ViewInvitation {
  fileName: string;
  fileExtension: string;
  fileSize: number;
}

export interface ViewCertificate {
  fileName: string;
  fileExtension: string;
  fileSize: number;
}

export interface ViewProgram {
  program_id: string;
  title: string;
  details: string;
  place: string;
  start_date: string;
  end_date: string;
  status: string;
  certificate: string;
  invitation: string;
  leader: ViewLeader;
  members: ViewMember[];
  partners: ViewPartner[];
  participants: ViewParticipant[];
  participant_count: number;
  invitation_content: ViewInvitation;
  certificate_content: ViewCertificate;
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

export interface ProgramFlow {
  flow: string;
  description: string;
}

export interface ProgramTopic {
  col_1: string;
  col_2: string;
  col_3: string;
}

export interface ProgramPosition {
  name: string;
  position: string;
}

export interface ProgramMembers {
  name: string;
}

export interface OtherDetails {
  flow: ProgramFlow[];
  topic: ProgramTopic[];
  position: ProgramPosition[];
  members: ProgramMembers[];
}
