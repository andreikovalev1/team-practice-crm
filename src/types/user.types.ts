export interface UserProfile {
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: string;
  email: string;
  department_name?: string;
  position_name?: string;
  profile?: UserProfile;
}