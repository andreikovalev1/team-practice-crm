"use client";

import { Plus } from "lucide-react";
import { BaseTable } from "@/components/CvsTable/BaseTable";
import SearchInput from "@/components/search/SearchInput";
import { ProjectTableRow } from "./ProjectTableRow";
import { CvProject } from "./types"; // Импортируем правильный тип отсюда
import { GoArrowDown } from "react-icons/go";

interface ProjectsTableProps {
  projects: CvProject[]; // Заменили на CvProject
  isReadOnly: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
  onDeleteProject: (p: CvProject) => void; // Заменили на CvProject
  onEditProject: (p: CvProject) => void;   // Заменили на CvProject
}

export function ProjectsTable({ 
  projects, isReadOnly, searchTerm, onSearchChange, onAddClick, onDeleteProject, onEditProject 
}: ProjectsTableProps) {
  
  const columns = [
    { header: "Name", className: "w-[30%] min-w-[200px]" },
    { header: "Domain", className: "w-[25%] min-w-[150px]" },
    { header: "Start Date", className: "w-[20%] min-w-[120px]" },
    { 
      header: (
        <div className="flex items-center gap-1">
          End Date <GoArrowDown className="text-gray-400" />
        </div>
      ), 
      className: "w-[20%] min-w-[120px]" 
    },
    { header: "", className: "w-[5%] min-w-[50px]" },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4 md:px-0">
        <SearchInput 
          value={searchTerm} 
          onChange={onSearchChange} 
          placeholder="Search"
        />
        
        {!isReadOnly && (
          <button 
            onClick={onAddClick}
            className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 font-bold text-sm uppercase tracking-wider hover:bg-red-50 transition-colors rounded-lg self-end md:self-auto"
          >
            <Plus size={18} /> Add Project
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <BaseTable 
          columns={columns} 
          isEmpty={projects.length === 0} 
          emptyText="No projects found."
        >
          {projects.map((item) => (
            <ProjectTableRow 
              // Обращаемся к id через item.project.id
              key={item.project.id} 
              project={item} 
              isReadOnly={isReadOnly}
              onDeleteClick={onDeleteProject}
              onEditClick={onEditProject}
            />
          ))}
        </BaseTable>
      </div>
    </div>
  );
}