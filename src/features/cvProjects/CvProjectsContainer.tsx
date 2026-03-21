"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useCvStore } from "@/store/useCvStore";
import { ProjectsTable } from "./ProjectsTable";
import { useProjectsLogic } from "./useProjectsLogic";
import { CvProject, GetCvProjectsResponse } from "./types";
import { GET_CV_PROJECTS } from "./graphql";
import { AddProjectModal } from "./AddProjectModal";
import { UpdateProjectModal } from "./UpdateProjectModal";

interface CvProjectsContainerProps {
  cvId: string;
  isReadOnly?: boolean;
}

export function CvProjectsContainer({ cvId, isReadOnly = false }: CvProjectsContainerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const projectsFromStore = useCvStore((state) => state.cvs[cvId]?.projects);
  const [editingProject, setEditingProject] = useState<CvProject | null>(null);
  const storeOwnerId = useCvStore((state) => state.cvs[cvId]?.userId);
  
  const setCvProjects = useCvStore((state) => state.setCvProjects);
  
  // ИЗМЕНЕНО: Достаем handleUpdateProject
  const { 
    handleRemoveProject, 
    handleAddProject, 
    handleUpdateProject, 
    isMutating 
  } = useProjectsLogic(cvId);
  
  const { data, loading, error } = useQuery<GetCvProjectsResponse>(GET_CV_PROJECTS, {
    variables: { cvId },
    skip: !!projectsFromStore, 
  });

  useEffect(() => {
    if (data?.cv?.projects) {
      setCvProjects(cvId, data.cv.projects, data.cv.user?.id);
    }
  }, [data, cvId, setCvProjects]);

  if (loading && !projectsFromStore) {
    return <div className="py-20 text-center text-gray-500 animate-pulse">Loading projects...</div>;
  }

  if (error && !projectsFromStore) {
    return <div className="py-20 text-center text-red-500">Error loading projects: {error.message}</div>;
  }

  const actualOwnerId = data?.cv?.user?.id || storeOwnerId;
  const displayProjects = projectsFromStore || [];
  const allEnvironments: string[] = Array.from(
    new Set(displayProjects.flatMap(p => p.project?.environment || []))
  ).sort();

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
  }

  return (
    <>
      <ProjectsTable 
        projects={filteredProjects}
        isReadOnly={isReadOnly || isMutating}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsAddModalOpen(true)}
        onDeleteProject={onDelete}
        onEditProject={(p) => setEditingProject(p)}
        ownerId={actualOwnerId}
      />

      <AddProjectModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProject}
      />

      {editingProject && (
        <UpdateProjectModal 
            isOpen={!!editingProject}
            onClose={() => setEditingProject(null)}
            cvProject={editingProject}
            onUpdate={(id, input) => {
              handleUpdateProject({ 
                projectId: id,
                start_date: input.start_date,
                end_date: input.end_date,
                roles: editingProject.roles || [],
                responsibilities: editingProject.responsibilities || []
              }); 
              setEditingProject(null);
            }}
            availableEnvironments={allEnvironments}
        />
      )}
    </>
  );
}