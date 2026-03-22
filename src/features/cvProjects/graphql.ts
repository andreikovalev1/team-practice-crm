import { gql } from "@apollo/client";

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

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($projectId: ID!) {
    project(projectId: $projectId) {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($project: CreateProjectInput!) {
    createProject(project: $project) {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($project: UpdateProjectInput!) {
    updateProject(project: $project) {
      ...ProjectFields
    }
  }
  ${PROJECT_FIELDS}
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($project: DeleteProjectInput!) {
    deleteProject(project: $project) {
      affected
    }
  }
`;

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