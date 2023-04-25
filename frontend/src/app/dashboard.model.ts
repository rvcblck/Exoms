export interface Faculty {
  user_id: string;
  fullName: string;
  email: string;
  total: number;
}

export interface ProgramCount {
  ongoing: number;
  upcoming: number;
  previous: number;
}

export interface ResponseData {
  program_count: ProgramCount;
  faculty: Faculty[];
  expire_data: ExpireData[];
  user_status: UserChart[];
}

export interface ChartData {
  x: string;
  y: number;
}

export interface UserChart {
  y: number;
  name: string;
}

export interface ExpireData {
  partner_id: string;
  partner_name: string;
  end_date: string;
}
