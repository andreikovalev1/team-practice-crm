"use client";

import { Trash2, MoreVertical, Edit } from "lucide-react";
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
  onDeleteClick?: (cv: Cv) => void;
  onUpdateClick: (cv: Cv) => void;
}

export function CvTableRow({ cv, userEmail, isReadOnly, onDeleteClick, onUpdateClick }: CvTableRowProps) {
  const router = useRouter();

  return (
    <tbody 
      onClick={() => router.push(ROUTES.CV_DETAILS(cv.id))}
      className="border-b border-gray-200 hover:bg-zinc-50/50 dark:hover:bg-[#454545] cursor-pointer transition-colors group"
    >
      <tr className="[&>td]:py-6 [&>td]:px-4 text-sm md:text-base">
        <td className="align-top font-medium text-gray-900 dark:text-gray-100 pr-2 break-words">
          {cv.name}
        </td>
        <td className="hidden md:table-cell align-top font-medium text-gray-900 dark:text-gray-300 pr-2 break-words">
          {cv.education || " "}
        </td>
        <td className="align-top font-medium text-gray-900 dark:text-gray-300 pr-2 break-all md:break-words">
          {userEmail}
        </td>
        
        <td className="align-top text-right w-10 md:w-14" onClick={(e) => e.stopPropagation()}>
          {!isReadOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-[#ECECED] focus:outline-none transition-colors ml-auto">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateClick?.(cv);
                  }}
                  className="cursor-pointer py-2.5"
                >
                  <Edit className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Update CV</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => onDeleteClick?.(cv)}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete CV</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </td>
      </tr>

      <tr className="text-sm md:hidden md:text-base [&>td]:pb-5">
        <td colSpan={3} className="px-4">
          <div className="text-gray-500 dark:text-gray-300 line-clamp-3 leading-relaxed break-words whitespace-normal">
            {cv.description}
          </div>
        </td>
      </tr>

      <tr className="text-sm hidden md:table-row md:text-base [&>td]:pb-5">
        <td colSpan={4} className="px-4">
          <div className="text-gray-500 dark:text-gray-300 line-clamp-3 leading-relaxed break-all whitespace-normal">
            {cv.description}
          </div>
        </td>
      </tr>

    </tbody>
  );
}