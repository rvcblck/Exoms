export interface Partner {
  partner_id: string;
  company_name: string;
  address: string;
  contact_no: string;
  contact_person: string;
  moa_file: string;
  contracts: Contract;
  [key: string]: any;
}

export interface Contract {
  contract_id: string;
  start_date: string;
  end_date: string;
}

// for view partner

export interface ViewContract {
  contract_id: string;
  start_date: string;
  end_date: string;
}

export interface ViewProgram {
  program_id: string;
  title: string;
}

export interface ViewPartner {
  partner_id: string;
  company_name: string;
  address: string;
  contact_no: string;
  contact_person: string;
  moa_file: string;
  contracts: ViewContract[];
  programs: ViewProgram[];
  moaFile_content: ViewMoa;
}

export interface ViewMoa {
  fileName: string;
  fileSize: number;
  fileExt: string;
}
