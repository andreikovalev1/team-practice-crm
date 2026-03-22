export interface Project {
  id: string;
  created_at: string;
  name: string;
  internal_name: string;
  domain: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  environment: string[];
}

export interface CvProject {
  project: Project;
  start_date: string;
  end_date?: string | null;
  roles: string[];
  responsibilities: string[]; 
}

export interface AddCvProjectInput {
  cvId: string;
  projectId: string;
  start_date: string;
  end_date?: string;
  roles: string[];
  responsibilities: string[];
}

export type UpdateCvProjectInput = AddCvProjectInput;

export interface RemoveCvProjectInput {
  cvId: string;
  projectId: string;
}

export interface GetProjectsResponse {
  projects: Project[];
}

export interface GetProjectByIdResponse {
  project: Project;
}

export interface CvProjectUpdateResponse {
  addCvProject?: {
    id: string;
    projects: CvProject[];
  };
  updateCvProject?: {
    id: string;
    projects: CvProject[];
  };
  removeCvProject?: {
    id: string;
    projects: CvProject[];
  };
}

export interface GetCvProjectsResponse {
  cv: {
    id: string;
    projects: CvProject[];
    user: {
        id: string;
    };
  };
}

export interface UpdateProjectInput {
  projectId: string;
  name: string;
  domain: string;
  start_date: string;
  end_date?: string;
  description: string;
  environment: string[];
}

export interface CreateProjectInput {
  name: string;
  domain: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  environment: string[];
}