export interface UserProfile {
  avatar?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

export type UserRole = "Employee" | "Admin";

export interface User {
  id: string;
  email: string;
  department_name?: string;
  position_name?: string;
  profile?: UserProfile;
  created_at?: string;
  role: UserRole;
  cvs?: { id: string }[];
}