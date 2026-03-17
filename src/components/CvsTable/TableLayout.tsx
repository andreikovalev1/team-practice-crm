"use client";

import { Search, Plus } from "lucide-react";

interface TableLayoutProps {
  children: React.ReactNode;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick?: () => void;
  createButtonText?: string;
  isReadOnly?: boolean;
}

export function TableLayout({
  children,
  searchTerm,
  onSearchChange,
  onCreateClick,
  createButtonText = "Create",
}: TableLayoutProps) {
  return (
    <div className="w-full">
      {/* Контейнер поиска и кнопки (AC-1: Позиционирование в одну строку) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
          />
        </div>

        {onCreateClick && (
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 text-[#C8372D] font-bold text-sm tracking-wide uppercase transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} />
            {createButtonText}
          </button>
        )}
      </div>

      {/* Обертка для скролла, если колонок станет много */}
      <div className="w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
}