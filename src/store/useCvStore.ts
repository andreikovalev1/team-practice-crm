import { create } from 'zustand';
import { CvProject } from '@/features/cvProjects/types'; // Твой тип

interface CvData {
  id: string;
  projects: CvProject[];
  // Сюда потом добавим skills: string[], info и т.д.
}

interface CvState {
  cvs: Record<string, CvData>;
  
  setCvProjects: (cvId: string, projects: CvProject[]) => void;
  updateCvProject: (cvId: string, project: CvProject) => void;
  removeCvProject: (cvId: string, projectId: string) => void;
  clearCv: (cvId: string) => void;
}

export const useCvStore = create<CvState>((set) => ({
  cvs: {},

  // Установка всех проектов (после загрузки с сервера)
  setCvProjects: (cvId, projects) => set((state) => ({
    cvs: {
      ...state.cvs,
      [cvId]: {
        ...state.cvs[cvId],
        id: cvId,
        projects: projects
      }
    }
  })),

  // Обновление одного проекта внутри CV
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

  // Удаление проекта
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