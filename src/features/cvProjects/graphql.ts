import { gql } from "@apollo/client";

// --- Фрагменты для переиспользования ---
export const PROJECT_FIELDS = gql`
  fragment ProjectFields on Project {
    id
    created_at
    name
    internal_name
    domain
    start_date
    end_date
    description
    environment
  }
`;

// --- Запросы ---

// 1. Получение ВСЕХ проектов (для админ-панели)
export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`;

// 2. Детальная информация по одному проекту
export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($projectId: ID!) {
    project(projectId: $projectId) {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`;

// --- Мутации для CV ---

// Добавление проекта в CV
export const ADD_CV_PROJECT = gql`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      id
      projects {
        id
        start_date
        end_date
        roles
        responsibilities
        project {
          ...ProjectFields
        }
      }
    }
  }
  ${PROJECT_FIELDS}
`;

// Обновление проекта в CV
export const UPDATE_CV_PROJECT = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      id
      projects {
        id
        start_date
        end_date
        roles
        responsibilities
        project {
          ...ProjectFields
        }
      }
    }
  }
   ${PROJECT_FIELDS} 
`;

// Удаление проекта из CV
export const REMOVE_CV_PROJECT = gql`
  mutation RemoveCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      id
      projects {
        project {
          id
        }
      }
    }
  }
`;

export const GET_CV_PROJECTS = gql`
  query GetCvProjects($cvId: ID!) {
    cv(cvId: $cvId) {
      id
      user {
        id
      }
      projects {
        id
        start_date
        end_date
        roles
        responsibilities
        project {
          ...ProjectFields
        }
      }
    }
  }
  ${PROJECT_FIELDS}
`;