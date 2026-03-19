"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useCvStore } from "@/store/useCvStore";
import { ProjectsTable } from "./ProjectsTable";
import { useProjectsLogic } from "./useProjectsLogic";
import { CvProject, GetCvProjectsResponse } from "./types";
import { GET_CV_PROJECTS } from "./graphql";

interface CvProjectsContainerProps {
  cvId: string;
  isReadOnly?: boolean;
}

export function CvProjectsContainer({ cvId, isReadOnly = false }: CvProjectsContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Zustand стор
  const projectsFromStore = useCvStore((state) => state.cvs[cvId]?.projects);
  const setCvProjects = useCvStore((state) => state.setCvProjects);
  
  // Бизнес-логика (мутации)
  const { handleRemoveProject, isMutating } = useProjectsLogic(cvId);

  // 1. Запрос данных с сервера
  // Сработает только если projectsFromStore === undefined (skip: !!projectsFromStore)
  const { data, loading, error } = useQuery<GetCvProjectsResponse>(GET_CV_PROJECTS, {
    variables: { cvId },
    skip: !!projectsFromStore, 
  });

  // 2. Синхронизируем стор Apollo -> Zustand при получении данных
  useEffect(() => {
    if (data?.cv?.projects) {
      setCvProjects(cvId, data.cv.projects);
    }
  }, [data, cvId, setCvProjects]);

  // 3. Состояние загрузки (только если данных еще нет в сторе)
  if (loading && !projectsFromStore) {
    return <div className="py-20 text-center text-gray-500 animate-pulse">Loading projects...</div>;
  }

  // 4. Ошибка (опционально)
  if (error && !projectsFromStore) {
    return <div className="py-20 text-center text-red-500">Error loading projects: {error.message}</div>;
  }

  const displayProjects = projectsFromStore || [];

  const filteredProjects = displayProjects.filter((p) =>
    p.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDelete = async (cvProj: CvProject) => {
    if (confirm(`Remove ${cvProj.project.name}?`)) {
      await handleRemoveProject(cvProj.project.id);
    }
  };

  return (
    <ProjectsTable 
      projects={filteredProjects}
      isReadOnly={isReadOnly || isMutating}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onAddClick={() => console.log("Open Add Modal")}
      onDeleteProject={onDelete}
      onEditProject={(p) => console.log("Open Edit Modal", p)}
    />
  );
}