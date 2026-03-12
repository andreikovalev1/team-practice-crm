import { gql } from "@apollo/client";

export const GET_PROFILE_LANGUAGES_QUERY = gql`
  query GetProfileLanguages($userId: ID!) {
    profile(userId: $userId) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;

export const GET_GLOBAL_LANGUAGES_QUERY = gql`
  query GetGlobalLanguages {
    languages {
      id
      name
      native_name
      iso2
    }
  }
`;

export const CREATE_LANGUAGE_MUTATION = gql`
  mutation CreateLanguage($language: CreateLanguageInput!) {
    createLanguage(language: $language) {
      id
      name
      native_name
      iso2
    }
  }
`;

export const ADD_PROFILE_LANGUAGE_MUTATION = gql`
  mutation AddProfileLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;

export const UPDATE_PROFILE_LANGUAGE_MUTATION = gql`
  mutation UpdateProfileLanguage($language: UpdateProfileLanguageInput!) {
    updateProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;

export const DELETE_PROFILE_LANGUAGE_MUTATION = gql`
  mutation DeleteProfileLanguage($language: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $language) {
      id
      languages {
        name
        proficiency
      }
    }
  }
`;