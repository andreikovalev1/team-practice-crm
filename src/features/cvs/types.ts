import type { User } from "@/types/user.types";

export interface GlobalCVs {
  id: string;
  name: string;
  description: string;
  education?: string;
  user?: User;
}

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
  userId?: string;    
  userEmail?: string; 
}

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

export interface CreateCvInput {
  name: string;
  description: string;
  education?: string;
  userId?: string; 
}
export interface CreateCvResponse {
  createCv: Cv;
}

export interface UpdateCvInput {
  cvId: string;
  name: string;
  description: string;
  education?: string;
}
export interface UpdateCvResponse {
  updateCv: Cv;
}

export interface DeleteCvInput {
  cvId: string;
}

export interface DeleteCvResponse {
  deleteCv: {
    affected: number;
  };
}