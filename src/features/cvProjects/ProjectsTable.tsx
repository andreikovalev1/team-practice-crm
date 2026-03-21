"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { BaseTable } from "@/components/CvsTable/BaseTable";
import SearchInput from "@/components/search/SearchInput";
import { ProjectTableRow } from "./ProjectTableRow";
import { CvProject } from "./types";
import { GoArrowUp } from "react-icons/go";
import { useIsOwnProfile } from "../profile/useIsOwnProfile";

interface ProjectsTableProps {
  projects: CvProject[];
  isReadOnly: boolean;
  searchTerm: string;
  ownerId?: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
  onDeleteProject: (p: CvProject) => void;
  onEditProject: (p: CvProject) => void;
  isAdminMode?: boolean;
}

type SortKey = "name" | "domain" | "start_date" | "end_date";
type SortConfigType = {
  key: SortKey;
  direction: "asc" | "desc";
} | null;

export function ProjectsTable({ 
  projects, isReadOnly, searchTerm, onSearchChange, onAddClick, ownerId, isAdminMode, onDeleteProject, onEditProject 
}: ProjectsTableProps) {
  const { isOwnProfile } = useIsOwnProfile(ownerId);
  const canModify = !isReadOnly && (isOwnProfile || isAdminMode);
  const [sortConfig, setSortConfig] = useState<SortConfigType>(null);
  
  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const displayedProjects = useMemo(() => {
    let filtered = projects.filter((p) =>
      p.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.project.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        let valA, valB;
        switch (sortConfig.key) {
          case "name":
            valA = a.project.name.toLowerCase();
            valB = b.project.name.toLowerCase();
            break;
          case "domain":
            valA = a.project.domain.toLowerCase();
            valB = b.project.domain.toLowerCase();
            break;
          case "start_date":
            valA = new Date(a.start_date || "1970-01-01").getTime();
            valB = new Date(b.start_date || "1970-01-01").getTime();
            break;
          case "end_date":
            valA = new Date(a.end_date || "9999-12-31").getTime();
            valB = new Date(b.end_date || "9999-12-31").getTime();
            break;
          default:
            return 0;
        }
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [projects, searchTerm, sortConfig]);

  const renderHeader = (label: string, key: SortKey) => {
    const isActive = sortConfig?.key === key;

    return (
      <div 
        className="flex items-center gap-1 cursor-pointer select-none group w-fit"
        onClick={() => handleSort(key)}
      >
        {label}
        <GoArrowUp 
          className={`transition-all duration-200 ${
            isActive ? "text-gray-900" : "text-gray-300 group-hover:text-gray-500"
          }`} 
          size={18}
        />
      </div>
    );
  };

  const columns = [
    { header: renderHeader("Name", "name"), className: "w-[45%] md:w-[30%] min-w-[140px]" },
    { header: renderHeader("Domain", "domain"), className: "w-[45%] md:w-[25%] min-w-[140px]" },
    { header: renderHeader("Start Date", "start_date"), className: "hidden md:table-cell md:w-[20%] min-w-[120px]" },
    { header: renderHeader("End Date", "end_date"), className: "hidden md:table-cell md:w-[20%] min-w-[120px]" },
    { header: "", className: "w-[10%] md:w-[5%] min-w-[40px]" },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between gap-4 mb-8 px-0 w-full">
        <div className="flex-1 md:flex-none">
          <SearchInput 
            value={searchTerm} 
            onChange={onSearchChange} 
            placeholder="Search"
          />
        </div>
        
        {canModify && (
          <button 
            onClick={onAddClick}
            className="flex items-center justify-center w-10 h-10 md:w-auto md:px-4 md:py-2 text-red-600 bg-red-50 hover:bg-red-100 md:bg-transparent md:hover:bg-red-50 transition-colors rounded-full font-bold text-sm uppercase tracking-wider shrink-0"
          >
            <Plus size={20} className="shrink-0" /> 
            <span className="hidden md:inline md:ml-2">
                {isAdminMode ? "Create Project" : "Add Project"}
            </span>
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <BaseTable 
          columns={columns} 
          isEmpty={displayedProjects.length === 0} 
          emptyText={searchTerm ? "No projects match your search." : "No projects found."}
        >
          {displayedProjects.map((item) => (
            <ProjectTableRow 
              key={item.project.id} 
              project={item} 
              isReadOnly={!canModify}
              onDeleteClick={onDeleteProject}
              onEditClick={onEditProject}
            />
          ))}
        </BaseTable>
      </div>
    </div>
  );
}