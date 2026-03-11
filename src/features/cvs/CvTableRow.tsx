"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import { Cv } from "./types";

interface CvTableRowProps {
  cv: Cv;
  userId: string;
  userEmail: string; // Email владельца профиля
  isReadOnly: boolean;
  onDeleteClick: (cv: Cv) => void;
}

export function CvTableRow({ cv, userId, userEmail, isReadOnly, onDeleteClick }: CvTableRowProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Переход внутрь CV (на вкладку DETAILS)
  const handleRowClick = () => {
    router.push(ROUTES.CV_DETAILS(userId, cv.id));
  };

  return (
    <tr 
      className="border-b border-gray-200 hover:bg-zinc-50/5 cursor-pointer transition-colors group relative"
      onClick={handleRowClick}
    >
      {/* КОЛОНКА 1: Name + Description */}
      <td className="py-6 pr-4 align-top w-1/2">
        <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          {cv.name}
        </div>
        <div className="text-sm text-gray-500 line-clamp-3">
          {cv.description}
        </div>
      </td>

      {/* КОЛОНКА 2: Education */}
      <td className="py-6 px-4 align-top text-gray-600 dark:text-gray-300">
        {cv.education || "—"}
      </td>

      {/* КОЛОНКА 3: Employee (Email) */}
      <td className="py-6 px-4 align-top text-gray-600 dark:text-gray-300">
        {userEmail}
      </td>

      {/* КОЛОНКА 4: Actions (Три точки) */}
      <td className="py-6 pl-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
        {!isReadOnly && (
          <div className="relative inline-block" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <MoreVertical size={20} />
            </button>

            {/* Выпадающее меню */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-md shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteClick(cv);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#C8372D] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                >
                  <Trash2 size={16} />
                  Delete CV
                </button>
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}