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

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      id
      created_at
      first_name
      last_name
      full_name
      avatar
    }
  }
`;

export const UPLOAD_AVATAR_MUTATION = gql`
  mutation UploadAvatar($avatar: UploadAvatarInput!) {
    uploadAvatar(avatar: $avatar)
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      department_name
      position_name
    }
  }
`;

export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($userId: ID!) {
    user(userId: $userId) {
      id
      email
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
`;
