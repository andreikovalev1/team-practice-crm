"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useCvStore } from "@/store/useCvStore";
import { ProjectsTable } from "./ProjectsTable";
import { useProjectsLogic } from "./useProjectsLogic";
import { CvProject, GetCvProjectsResponse } from "./types";
import { GET_CV_PROJECTS } from "./graphql";
import { AddProjectModal } from "./AddProjectModal";

interface CvProjectsContainerProps {
  cvId: string;
  isReadOnly?: boolean;
}

export function CvProjectsContainer({ cvId, isReadOnly = false }: CvProjectsContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const projectsFromStore = useCvStore((state) => state.cvs[cvId]?.projects);
  const setCvProjects = useCvStore((state) => state.setCvProjects);
  const { handleRemoveProject, handleAddProject, isMutating } = useProjectsLogic(cvId);
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

  const filteredProjects = displayProjects.filter((p) => {
    const name = p.project?.name || "";
    const domain = p.project?.domain || "";
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || domain.toLowerCase().includes(term);
  });

  const onDelete = async (cvProj: CvProject) => {
    if (confirm(`Remove ${cvProj.project.name}?`)) {
      await handleRemoveProject(cvProj.project.id);
    }
  };

  return (
    <>
      <ProjectsTable 
        projects={filteredProjects}
        isReadOnly={isReadOnly || isMutating}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsAddModalOpen(true)}
        onDeleteProject={onDelete}
        onEditProject={(p) => console.log("Open Edit Modal", p)}
      />

      <AddProjectModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProject} // Эта функция уже есть в твоем useProjectsLogic
      />
    </>
  );
}