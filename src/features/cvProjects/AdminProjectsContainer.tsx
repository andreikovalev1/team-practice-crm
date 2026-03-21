"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_PROJECTS, CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from "./graphql";
import { ProjectsTable } from "./ProjectsTable";
import { Project, CvProject, UpdateProjectInput, CreateProjectInput } from "./types";
import { CreateProjectModal } from "./CreateProjectModal";
import { UpdateProjectModal } from "./UpdateProjectModal";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { useModalStore } from "@/store/useModalStore";
import toast from "react-hot-toast";

// Интерфейс для аргументов создания, если он не импортирован из типов
interface CreateProjectFormInput {
  name: string;
  domain: string;
  start_date: string;
  end_date?: string;
  description: string;
  environment: string[];
}

export function AdminProjectsContainer() {
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const isCreateModalOpen = useModalStore((state) => state.isProjectCreateOpen);
  const closeCreateModal = useModalStore((state) => state.closeProjectCreate);

  const { data, loading, error } = useQuery<{ projects: Project[] }>(GET_ALL_PROJECTS);

  // --- Мутации с типизированными коллбэками ---

  const [createProject] = useMutation<{ createProject: Project }, { project: CreateProjectInput }>(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_ALL_PROJECTS }],
    onCompleted: () => {
      toast.success("Project created successfully!");
      closeCreateModal();
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const [updateProject] = useMutation<{ updateProject: Project }, { project: UpdateProjectInput }>(UPDATE_PROJECT, {
    refetchQueries: [{ query: GET_ALL_PROJECTS }],
    onCompleted: () => {
      toast.success("Project updated!");
      setIsUpdateModalOpen(false);
      setSelectedProjectForEdit(null);
    },
    onError: (err) => toast.error(`Update failed: ${err.message}`),
  });

  const [deleteProject] = useMutation<{ deleteProject: { affected: number } }, { project: { projectId: string } }>(DELETE_PROJECT, {
    refetchQueries: [{ query: GET_ALL_PROJECTS }],
    onCompleted: () => {
      toast.success("Project deleted");
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    },
    onError: (err) => toast.error(`Delete failed: ${err.message}`),
  });

  if (loading) return <div className="py-20 text-center animate-pulse text-gray-500">Loading...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error: {error.message}</div>;

  const allEnvironments: string[] = Array.from(
    new Set((data?.projects || []).flatMap(p => p.environment || []))
  ).sort();

  const mappedProjects: CvProject[] = (data?.projects || []).map(p => ({
    id: p.id,
    project: p,
    start_date: p.start_date,
    end_date: p.end_date,
    roles: [],
    responsibilities: p.environment || [],
  }));

  const handleCreate = (input: CreateProjectFormInput) => {
    createProject({
      variables: {
        project: {
          name: input.name,
          domain: input.domain,
          start_date: input.start_date,
          end_date: input.end_date || undefined,
          description: input.description,
          environment: input.environment,
        },
      },
    });
  };

  const handleUpdate = (id: string, input: UpdateProjectInput) => {
    updateProject({
      variables: {
        project: {
          ...input,
          projectId: id,
          end_date: input.end_date || undefined,
        },
      },
    });
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject({
        variables: {
          project: { projectId: projectToDelete.id }
        }
      });
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
      <ProjectsTable
        projects={mappedProjects}
        isReadOnly={false}
        onDeleteProject={(cvProj) => {
          setProjectToDelete(cvProj.project);
          setIsDeleteModalOpen(true);
        }}
        onEditProject={(cvProj) => {
          setSelectedProjectForEdit(cvProj.project);
          setIsUpdateModalOpen(true);
        }}
        isAdminMode={true}
      />

      {/* Модалки */}
      <DeleteProjectModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        projectName={projectToDelete?.name || ""}
      />

      {selectedProjectForEdit && (
        <UpdateProjectModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          projectToEdit={selectedProjectForEdit}
          onUpdate={handleUpdate}
          availableEnvironments={allEnvironments}
        />
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreate={handleCreate}
        availableEnvironments={allEnvironments}
      />
    </div>
  );
}