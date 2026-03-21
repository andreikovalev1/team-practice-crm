"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_PROJECTS, CREATE_PROJECT, UPDATE_PROJECT } from "./graphql";
import { ProjectsTable } from "./ProjectsTable";
import { Project, CvProject, UpdateProjectInput } from "./types";
import { CreateProjectModal } from "./CreateProjectModal";
import { UpdateProjectModal } from "./UpdateProjectModal";

export function AdminProjectsContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, loading, error } = useQuery<{ projects: Project[] }>(GET_ALL_PROJECTS);

  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_ALL_PROJECTS }],
  });

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [{ query: GET_ALL_PROJECTS }],
  });

  if (loading) return <div className="py-20 text-center animate-pulse text-gray-500">Loading all projects...</div>;
  if (error) return <div className="py-20 text-center text-red-500 font-medium">Error: {error.message}</div>;

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

  const filtered = mappedProjects.filter(p =>
    p.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (cvProj: CvProject) => {
    setSelectedProjectForEdit(cvProj.project);
    setIsUpdateModalOpen(true);
  };

  // ---- Обработчик создания ----
  const handleCreate = async (input: {
    name: string;
    domain: string;
    start_date: string;
    end_date?: string;
    description: string;
    environment: string[];
  }) => {
    await createProject({
      variables: {
        project: {
          name: input.name,
          domain: input.domain,
          start_date: input.start_date,
          end_date: input.end_date || null,
          description: input.description,
          environment: input.environment,
        },
      },
    });
  };

  const handleUpdate = async (id: string, input: UpdateProjectInput) => {
    await updateProject({
      variables: {
        project: {
          projectId: id,
          name: input.name,
          domain: input.domain,
          start_date: input.start_date,
          end_date: input.end_date || null,
          description: input.description,
          environment: input.environment,
        },
      },
    });
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      <ProjectsTable
        projects={filtered}
        isReadOnly={false}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsCreateModalOpen(true)}
        onDeleteProject={(p) => console.log("Delete Global Project", p)}
        onEditProject={handleEditClick}
        isAdminMode={true}
      />

      {/* Модалка обновления */}
      {selectedProjectForEdit && (
        <UpdateProjectModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedProjectForEdit(null);
          }}
          projectToEdit={selectedProjectForEdit}
          onUpdate={handleUpdate}
          availableEnvironments={allEnvironments}
        />
      )}

      {/* Модалка создания */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        availableEnvironments={allEnvironments}
      />
    </div>
  );
}