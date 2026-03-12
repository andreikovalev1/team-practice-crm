import { gql } from "@apollo/client";

export const GET_DEPARTMENTS_QUERY = gql`
  query GetDepartments {
    departments {
      id
      name
    }
  }
`;

export const GET_POSITIONS_QUERY = gql`
  query GetPositions {
    positions {
      id
      name
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      email
      role
      # Если бэкенд отдает что-то еще после создания (например, profile),
      # можешь дописать эти поля сюда, чтобы Apollo сам обновил кэш.
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      affected
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      email
      role
      department_name
      position_name
    }
  }
`;