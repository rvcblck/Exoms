export interface Profile {
  id: number;
  user_id: string;
  fname: string;
  mname: string | null;
  lname: string;
  suffix: string | null;
  gender: string;
  bday: string;
  email: string;
  email_verified_at: string | null;
  password_id: string;
  mobile_no: string | null;
  address: string | null;
  role: 'admin' | 'user';
  status: string;
  archived: number;
  profile_pic: string | null;
  created_at: string;
  updated_at: string;
}
