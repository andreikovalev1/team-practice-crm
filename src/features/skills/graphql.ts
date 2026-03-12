import { gql } from "@apollo/client/core";

export const GET_PROFILE_SKILLS_QUERY = gql`
  query GetProfileSkills($userId: ID!) {
    profile(userId: $userId) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const GET_GLOBAL_SKILLS_QUERY = gql`
  query GetGlobalSkills {
    skills {
      id
      name
      category_name
    }
  }
`;

export const CREATE_SKILL_MUTATION = gql`
  mutation CreateSkill ($skill: CreateSkillInput!) {
    createSkill (skill: $skill) {
      id
      name
      category_name
    }
  }
`;

export const ADD_PROFILE_SKILL_MUTATION = gql`
  mutation AddProfileSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const UPDATE_PROFILE_SKILL_MUTATION = gql`
  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const DELETE_PROFILE_SKILL_MUTATION = gql`
  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const GET_SKILL_CATEGORIES_QUERY = gql`
  query GetSkillCategories {
    skillCategories {
      id
      name
    }
  }
`;