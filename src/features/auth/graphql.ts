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
        profile {
          first_name
          last_name
          avatar
        }
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

// Запрос на отправку письма для сброса пароля
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($auth: ForgotPasswordInput!) {
    forgotPassword(auth: $auth)
  }
`;

// Установка нового пароля
export const RESET_PASSWORD_MUTATION = gql`
    mutation ResetPassword($auth: ResetPasswordInput!) {
    resetPassword(auth: $auth)
    }
`;