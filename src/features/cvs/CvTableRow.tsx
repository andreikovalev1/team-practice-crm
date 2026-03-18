"use client";

import { Trash2, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import { Cv } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CvTableRowProps {
  cv: Cv;
  userId: string;
  userEmail: string;
  isReadOnly: boolean;
  onDeleteClick: (cv: Cv) => void;
}

export function CvTableRow({ cv, userEmail, isReadOnly, onDeleteClick }: CvTableRowProps) {
  const router = useRouter();

  return (
    <tbody 
      onClick={() => router.push(ROUTES.CV_DETAILS(cv.id))}
      className="border-b border-gray-200 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors group"
    >
      <tr className="[&>td]:py-6 [&>td]:px-4">
        <td className="align-top font-medium text-gray-900 dark:text-gray-100">{cv.name}</td>
        <td className="align-top font-medium text-gray-900 dark:text-gray-300">{cv.education || "—"}</td>
        <td className="align-top font-medium text-gray-900 dark:text-gray-300">{userEmail}</td>
        
        <td className="align-top text-right" onClick={(e) => e.stopPropagation()}>
          {!isReadOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none transition-colors ml-auto">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                <DropdownMenuItem 
                  onClick={() => onDeleteClick(cv)}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 py-2.5"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete CV</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </td>
      </tr>
      <tr className="[&>td]:pb-5 [&>td]:px-4">
        <td colSpan={4} className="align-top">
          <div className="text-base text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {cv.description}
          </div>
        </td>
      </tr>
    </tbody>
  );
}