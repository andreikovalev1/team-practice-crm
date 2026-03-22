export interface GlobalDepartment {
  id: string;
  name: string;
}


export interface GetGlobalDepartmentsResponse {
  departments: GlobalDepartment[];
}