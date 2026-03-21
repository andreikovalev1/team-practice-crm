// 1. Базовая сущность проекта из БД
export interface Project {
  id: string;
  created_at: string; // ДОБАВЛЕНО: присутствовало во фрагменте, но не в типе
  name: string;
  internal_name: string;
  domain: string;
  start_date: string;
  end_date?: string | null; // Apollo может вернуть null, если дата не указана
  description: string;
  environment: string[];
}

// 2. Сущность проекта внутри CV
export interface CvProject {
  project: Project;
  start_date: string; // ИСПРАВЛЕНО: camelCase (startDate) заменен на snake_case, как в ответе GraphQL
  end_date?: string | null; // ИСПРАВЛЕНО: аналогично
  roles: string[];
  responsibilities: string[]; 
}

// 3. Входные типы для мутаций (согласно структуре API)
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

// 4. Ответы для Apollo
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

// types.ts (примерное содержимое)
export interface UpdateProjectInput {
  projectId: string; // Входящий ID
  name: string;
  domain: string;
  start_date: string;
  end_date?: string;
  description: string;
  environment: string[]; // Из макета видно, что это стек, а не 'split' строка
}