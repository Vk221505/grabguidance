export interface LoginPayload {
   email: string,
   password: string
}

export interface Transaction {
  code: number
  countExpert: number
  countUser: number
  multiSessionCount: number
  singleSessionCount: number
  status: string;
  totalAmount: string;
}

export interface CurrentSession {
  user_name: string,
  id_expert: string,
  id_session: number,
  multi: number,
  session_date: string,
  session_end: string,
  session_start: string,
  expert_name?: string;
}

export interface User {
  edit_by: "user"
  edit_date: "2020-12-05T12:21:02.000Z"
  add_date: string,
  date_of_birth: string,
  full_name: string,
  gender: number,
  id_user: number,
  profile_pic: any
  sessions: number,
  status: number,
  user_email: string,
  user_mobile: string
}

export interface Expert {
  add_date: string,
  approved: number,
  details: number,
  base_price: number,
  epert_mobile: string,
  expert_email: string,
  full_name: string,
  id_expert: number,
  id_gender: number,
  sessions: number,
  status: number,
  edit_by: string,
  edit_date: string
}

export interface Session {
  price: any;
  add_date: string,
  status: number,
  expert_name: string,
  id_expert: number,
  id_session: number,
  multi: number,
  session_date: string,
  session_end: string,
  session_start: string,
  user_name: string
  cancelled: null
  cancelled_on: null
  created: "user"
  recheduled: string
  recheduled_on: string
}

export interface CurrentSessionResponse {
   code: number,
   recentRecords: CurrentSession[],
   status: string
}

export interface AdminUserResponse {
  code: number,
  users: User[],
  status: string
}

export interface AdminSessionResponse {
   code: number,
   recentRecords: Session[],
   status: string
}

export interface AdminExpertResponse {
  code: number,
  experts: Expert[],
  status: string
}


