export type UserRole = "Employee" | "Admin";

export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}

export interface GetDepartmentsResponse {
  departments: Department[];
}

export interface GetPositionsResponse {
  positions: Position[];
}

export interface CreateUserFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  positionId: string;
  role: UserRole;
}

export interface CreateUserInput {
  auth: {
    email: string;
    password?: string;
  };
  profile: {
    first_name: string;
    last_name: string;
  };
  cvsIds: string[];
  departmentId?: string | null;
  positionId?: string | null;
  role: UserRole;
}

export interface CreateUserMutationVariables {
  user: CreateUserInput;
}

export interface UpdateUserInput {
  userId: string;
  cvsIds?: string[];
  departmentId?: string | null;
  positionId?: string | null;
  role?: UserRole;
}

export interface UpdateUserMutationVariables {
  user: UpdateUserInput;
}