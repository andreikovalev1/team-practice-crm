import { gql } from "@apollo/client";

// Логин — это QUERY (запрос)
export const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      user {
        id
        email
        role
      }
    }
  }
`;

// Регистрация — это MUTATION (мутация)
export const REGISTER_MUTATION = gql`
  mutation Register($auth: AuthInput!) {
    signup(auth: $auth) {
      access_token
      user {
        id
        email
      }
    }
  }
`;