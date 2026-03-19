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

export const GET_SKILL_CATEGORIES_QUERY = gql`
  query GetSkillCategories {
    skillCategories {
      id
      name
    }
  }
`;

export const GET_CV_SKILLS_QUERY = gql`
  query GetCvSkills($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const UPDATE_SKILL_MUTATION = gql`
  mutation UpdateSkill($skill: UpdateSkillInput!) {
    updateSkill(skill: $skill) {
      id
      name
      category_name
    }
  }
`;

export const UPDATE_CV_SKILL_MUTATION = gql`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
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

export const ADD_CV_SKILL_MUTATION = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const DELETE_CV_SKILL_MUTATION = gql`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      id
      skills {
        name
        categoryId
        mastery
      }
    }
  }
`;

export const DELETE_SKILL_MUTATION = gql`
  mutation DeleteSkill($skill: DeleteSkillInput!) {
    deleteSkill(skill: $skill) {
      affected
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