"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { Cv } from "./types";
import { CvTableRow } from "./CvTableRow";

interface CvsTableProps {
  cvs: Cv[];
  userId: string;
  userEmail: string;
  isReadOnly: boolean;
  onDeleteClick: (cv: Cv) => void;
  // Пропсы для сортировки
  sortDirection: "asc" | "desc";
  onSortToggle: () => void;
}

export function CvsTable({
  cvs,
  userId,
  userEmail,
  isReadOnly,
  onDeleteClick,
  sortDirection,
  onSortToggle,
}: CvsTableProps) {
  
  if (cvs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg mt-8">
        No CVs found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto mt-8">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200 text-sm font-semibold text-gray-900 dark:text-gray-100">
            
            <th 
              className="py-4 pr-4 cursor-pointer hover:text-gray-600 transition-colors group w-1/2"
              onClick={onSortToggle}
            >
              <div className="flex items-center gap-2">
                Name
                <span className="text-gray-400 group-hover:text-gray-600">
                  {sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </span>
              </div>
            </th>
            
            <th className="py-4 px-4">Education</th>
            <th className="py-4 px-4">Employee</th>
            <th className="py-4 pl-4"></th>
          </tr>
        </thead>
        
        <tbody>
          {cvs.map((cv) => (
            <CvTableRow
              key={cv.id}
              cv={cv}
              userId={userId}
              userEmail={userEmail}
              isReadOnly={isReadOnly}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}