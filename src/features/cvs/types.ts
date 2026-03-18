import type { User } from "@/types/user.types";

// --- Для глобальной таблицы ---
export interface GlobalCVs {
  id: string;
  name: string;
  description: string;
  education?: string;
  user?: User;
}

// --- Для обычного пользователя ---
export interface Cv {
  id: string;
  name: string;
  description: string;
  education?: string;
  user?: User,

}

export interface CvForTable {
  id: string;
  name: string;
  description: string;
  education?: string;
  userId?: string;    // будет undefined для Global без пользователя
  userEmail?: string; // аналогично
}
// --- Ответы GraphQL ---
export interface GetGlobalCVsResponse {
  cvs: GlobalCVs[];
}

export interface GetUserCvsResponse {
  user: {
    id: string;
    email: string;
    cvs: Cv[];
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