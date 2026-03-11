"use client";

import { cn } from "@/lib/utils";
import { ProfileLanguage } from "./types";

interface LanguageItemProps {
  language: ProfileLanguage;
  isReadOnly: boolean;
  isRemoveMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (name: string) => void;
  onEditClick?: (language: ProfileLanguage) => void;
}

const getProficiencyColor = (proficiency: string) => {
  const p = proficiency.toLowerCase();
  if (p === "a1" || p === "a2") return "text-blue-500";
  if (p === "b1" || p === "b2") return "text-green-500";
  if (p === "c1" || p === "c2") return "text-yellow-500";
  if (p === "native") return "text-red-500";
  return "text-gray-500";
};

export function LanguageItem({
  language,
  isReadOnly,
  isRemoveMode,
  isSelected,
  onToggleSelect,
  onEditClick,
}: LanguageItemProps) {
  const colorClass = getProficiencyColor(language.proficiency);

  return (
    <div
      className={cn(
        "flex items-center gap-6 p-3 rounded-md transition-colors w-full",
        isRemoveMode ? "hover:bg-red-50 cursor-pointer" : !isReadOnly && "hover:bg-gray-100 cursor-pointer"
      )}
      onClick={() => {
        if (isRemoveMode) {
          onToggleSelect?.(language.name);
        } else if (!isReadOnly) {
          onEditClick?.(language);
        }
      }}
    >
      {/* ЧЕКБОКС */}
      {isRemoveMode && (
        <input
          type="checkbox"
          checked={Boolean(isSelected)}
          onChange={() => onToggleSelect?.(language.name)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-red-600 rounded border-gray-300 cursor-pointer shrink-0"
        />
      )}

      {/* УРОВЕНЬ ВЛАДЕНИЯ */}
      <span className={cn("font-medium w-12 shrink-0 select-none text-sm", colorClass)}>
        {language.proficiency}
      </span>

      {/* НАЗВАНИЕ ЯЗЫКА */}
      <span className="text-gray-400 font-medium truncate flex-1 min-w-0 select-none text-sm">
        {language.name}
      </span>
    </div>
  );
}