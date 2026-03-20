import { create } from 'zustand';
import { CvProject } from '@/features/cvProjects/types';

interface CvData {
  id: string;
  projects: CvProject[];
  userId?: string;
}

interface CvState {
  cvs: Record<string, CvData>;
  
  setCvProjects: (cvId: string, projects: CvProject[], userId?: string) => void;
  updateCvProject: (cvId: string, project: CvProject) => void;
  removeCvProject: (cvId: string, projectId: string) => void;
  clearCv: (cvId: string) => void;
}

export const useCvStore = create<CvState>((set) => ({
  cvs: {},

  setCvProjects: (cvId, projects, userId) => set((state) => ({
    cvs: {
      ...state.cvs,
      [cvId]: {
        ...state.cvs[cvId],
        id: cvId,
        projects,
        userId: userId ?? state.cvs[cvId]?.userId,
      }
    }
  })),

  updateCvProject: (cvId, updatedProject) => set((state) => {
    const currentCv = state.cvs[cvId];
    if (!currentCv) return state;

    return {
      cvs: {
        ...state.cvs,
        [cvId]: {
          ...currentCv,
          projects: currentCv.projects.map(p => 
            p.project.id === updatedProject.project.id ? updatedProject : p
          )
        }
      }
    };
  }),

  removeCvProject: (cvId, projectId) => set((state) => {
    const currentCv = state.cvs[cvId];
    if (!currentCv) return state;

    return {
      cvs: {
        ...state.cvs,
        [cvId]: {
          ...currentCv,
          projects: currentCv.projects.filter(p => p.project.id !== projectId)
        }
      }
    };
  }),

  clearCv: (cvId) => set((state) => {
    const newCvs = { ...state.cvs };
    delete newCvs[cvId];
    return { cvs: newCvs };
  })
}));