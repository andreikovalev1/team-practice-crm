import { gql } from "@apollo/client/core";

export const GET_GLOBAL_CVS_QUERY = gql`
  query GetGlobalCvs {
    cvs {
      id
      name
      description
      education
    }
  }
`;

// Запрашиваем пользователя и массив его резюме для таблицы
export const GET_USER_CVS_QUERY = gql`
  query GetUserCvs($userId: ID!) {
    user(userId: $userId) {
      id
      cvs {
        id
        name
        description
        education
      }
    }
  }
`;

// Запрашиваем одно конкретное резюме (понадобится для таба DETAILS)
export const GET_CV_BY_ID_QUERY = gql`
  query GetCvById($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      name
      description
      education
    }
  }
`;

// Мутация создания
export const CREATE_CV_MUTATION = gql`
  mutation CreateCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      id
      name
      description
      education
    }
  }
`;

// Мутация обновления
export const UPDATE_CV_MUTATION = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      description
      education
    }
  }
`;

// Мутация удаления
export const DELETE_CV_MUTATION = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;