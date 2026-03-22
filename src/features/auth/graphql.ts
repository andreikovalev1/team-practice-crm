import { gql } from "@apollo/client";

export const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        id
        email
        role
        created_at
        department_name
        position_name
        profile {
          first_name
          last_name
          avatar
        }
      }
    }
  }
`;

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

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
    mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
    }
`;