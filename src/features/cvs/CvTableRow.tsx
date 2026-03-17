"use client";

import { Trash2 } from "lucide-react";
import { ActionMenu } from "@/components/CvsTable/ActionMenu";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import { Cv } from "./types";

interface CvTableRowProps {
  cv: Cv;
  userId: string;
  userEmail: string;
  isReadOnly: boolean;
  onDeleteClick: (cv: Cv) => void;
}

export function CvTableRow({ cv, userId, userEmail, isReadOnly, onDeleteClick }: CvTableRowProps) {
  const router = useRouter();

  return (
    <tbody 
      onClick={() => router.push(ROUTES.CV_DETAILS(userId, cv.id))}
      className="border-b border-gray-200 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors group"
    >
      <tr className="[&>td]:py-6 [&>td]:px-4">
        <td className="align-top font-medium text-gray-900 dark:text-gray-100">
          {cv.name}
        </td>
        <td className="align-top font-medium text-gray-900 dark:text-gray-300">
          {cv.education || "—"}
        </td>
        <td className="align-top font-medium text-gray-900 dark:text-gray-300">
          {userEmail}
        </td>
        <td className="align-top text-right">
          {!isReadOnly && (
            <ActionMenu>
              <button
                onClick={() => onDeleteClick(cv)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#C8372D] hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 size={16} /> Delete CV
              </button>
            </ActionMenu>
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