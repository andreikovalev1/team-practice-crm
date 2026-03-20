"use client";

import { Trash2, MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CvProject } from "./types";

interface ProjectTableRowProps {
  project: CvProject; 
  isReadOnly: boolean;
  onDeleteClick: (project: CvProject) => void;
  onEditClick: (project: CvProject) => void;
}

export function ProjectTableRow({ project, isReadOnly, onDeleteClick, onEditClick }: ProjectTableRowProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Till now";
    try {
      return new Intl.DateTimeFormat("ru-RU").format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <tbody 
      onClick={() => !isReadOnly && onEditClick(project)}
      className="border-b border-gray-200 hover:bg-zinc-50/50 transition-colors cursor-pointer group"
    >
      <tr className="[&>td]:py-4 [&>td]:px-4 text-sm md:text-base font-medium text-gray-900">
        <td className="w-[30%] min-w-[200px] align-top">{project.project.name}</td>
        <td className="w-[25%] min-w-[150px] align-top">{project.project.domain}</td>
        <td className="w-[20%] min-w-[120px] align-top">{formatDate(project.start_date)}</td>
        <td className="w-[20%] min-w-[120px] align-top">{formatDate(project.end_date)}</td>
        
        <td className="w-[5%] min-w-[50px] align-top text-right" onClick={(e) => e.stopPropagation()}>
          {!isReadOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors ml-auto">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                <DropdownMenuItem 
                  onClick={() => onDeleteClick(project)}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </td>
      </tr>

      <tr className="text-sm md:text-base [&>td]:pb-6">
        <td colSpan={5} className="px-4">
          <p className="text-gray-500 mb-4 leading-relaxed max-w-4xl">
            {project.project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {project.responsibilities?.map((resp, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium border">
                {resp}
                </span>
            ))}
          </div>
        </td>
      </tr>
    </tbody>
  );
}