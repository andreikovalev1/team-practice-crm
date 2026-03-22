import { gql } from "@apollo/client/core";

export const GET_GLOBAL_CVS_QUERY = gql`
  query GetGlobalCvs {
    cvs {
      id
      name
      description
      education
      user {
        id
        email
      }
    }
  }
`;

export const UPDATE_GLOBAL_CV_MUTATION = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      id
      name
      description
      education
    }
  }
`;

export const GET_USER_CVS_QUERY = gql`
  query GetUserCvs($userId: ID!) {
    user(userId: $userId) {
      id
      email
      cvs {
        id
        name
        description
        education
      }
    }
  }
`;

export const GET_CV_BY_ID_QUERY = gql`
  query GetCvById($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      name
      description
      education
      user {
        id
        position_name
        profile {
          first_name
          last_name
        }
      }
    }
  }
`;

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

export const DELETE_CV_MUTATION = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;