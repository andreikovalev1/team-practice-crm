import { gql } from "@apollo/client/core";

export const GET_GLOBAL_DEPARTMENT_QUERY = gql`
  query GetGlobalDepartments {
  departments {
    id
    name
  }
}
`;

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment ($department: UpdateDepartmentInput!) {
    updateDepartment (department: $department) {
        id
        name
    }
  }
`;

export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment ($department: DeleteDepartmentInput!) {
    deleteDepartment (department: $department) {
        affected
    }
  }
`;

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($department: CreateDepartmentInput!) {
    createDepartment (department: $department) {
      id
      name
    }
  }
`;