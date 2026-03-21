"use client";

import { Trash2, MoreVertical, Pencil } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CvProject } from "./types";
import toast from "react-hot-toast";

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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick(project);
  };

  return (
    <tbody 
      className="border-b border-gray-200 hover:bg-zinc-50/50 transition-colors cursor-pointer"
    >
      <tr className="[&>td]:py-4 [&>td]:px-4 text-sm md:text-base font-medium text-gray-900">
        <td className="w-[45%] md:w-[30%] min-w-[140px] align-top">{project.project.name}</td>
        <td className="w-[45%] md:w-[25%] min-w-[140px] align-top">{project.project.domain}</td>
        <td className="hidden md:table-cell md:w-[20%] min-w-[120px] align-top">{formatDate(project.start_date)}</td>
        <td className="hidden md:table-cell md:w-[20%] min-w-[120px] align-top">{formatDate(project.end_date)}</td>
        <td className="w-[10%] md:w-[5%] min-w-[40px] align-top text-right" onClick={(e) => e.stopPropagation()}>
          {!isReadOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors ml-auto">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                <DropdownMenuItem 
                  onClick={handleEdit}
                  className="cursor-pointer py-2.5 transition-colors focus:bg-gray-50"
                >
                  <Pencil className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Update Project</span>
                </DropdownMenuItem>
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