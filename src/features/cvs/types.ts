// --- БАЗОВЫЕ ТИПЫ ---
export interface Cv {
  id: string;
  name: string;
  description: string;
  education?: string;
  // Позже мы добавим сюда projects, skills и languages
}

// --- ОТВЕТЫ НА ЗАПРОСЫ (QUERIES) ---
export interface GetUserCvsResponse {
  user: {
    id: string;
    cvs: Cv[]; // Массив резюме пользователя
  };
}

export interface GetCvByIdResponse {
  cv: Cv;
}

// --- ТИПЫ ДЛЯ МУТАЦИЙ (INPUTS И RESPONSES) ---

// 1. Create
export interface CreateCvInput {
  name: string;
  description: string;
  education?: string;
  userId?: string; 
}
export interface CreateCvResponse {
  createCv: Cv;
}

// 2. Update
export interface UpdateCvInput {
  cvId: string;
  name: string;
  description: string;
  education?: string;
}
export interface UpdateCvResponse {
  updateCv: Cv;
}

// 3. Delete
export interface DeleteCvInput {
  cvId: string;
}
export interface DeleteCvResponse {
  deleteCv: {
    affected: number;
  };
}