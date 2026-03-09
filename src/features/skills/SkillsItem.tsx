"use client";

import { ProfileSkillMastery } from "./types";
import { cn } from "@/lib/utils";

interface SkillsItemProps {
  skill: ProfileSkillMastery;
  isReadOnly: boolean;
  isRemoveMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (name: string) => void;
  onEditClick?: (skill: ProfileSkillMastery) => void; 
}

const levels = ["Novice", "Advanced", "Competent", "Proficient", "Expert"];

const getMasteryLevel = (mastery: string): number => {
  const index = levels.findIndex(
    (l) => l.toLowerCase() === mastery?.toLowerCase()
  );
  return index >= 0 ? index + 1 : 1;
};

const getMasteryColor = (level: number) => {
  if (level >= 5) return "bg-red-600";
  if (level === 4) return "bg-yellow-500";
  if (level === 3) return "bg-green-700";
  if (level === 2) return "bg-blue-500";
  return "bg-gray-500";
};

const getMasteryTrackColor = (level: number) => {
  if (level >= 5) return "bg-red-300";
  if (level === 4) return "bg-yellow-300/50";
  if (level === 3) return "bg-green-700/30";
  if (level === 2) return "bg-blue-300";
  return "bg-gray-300";
};

export function SkillsItem({
  skill,
  isReadOnly,
  isRemoveMode,
  isSelected,
  onToggleSelect,
  onEditClick,
}: SkillsItemProps) {
  const masteryLevel = getMasteryLevel(skill.mastery);
  const colorClass = getMasteryColor(masteryLevel);
  const trackColorClass = getMasteryTrackColor(masteryLevel);

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 rounded-md transition-colors",
        // Добавляем эффект наведения, если можно редактировать или удалять
        isRemoveMode ? "hover:bg-red-50 cursor-pointer" : !isReadOnly && "hover:bg-gray-50 cursor-pointer"
      )}
      onClick={() => {
        if (isRemoveMode) {
          onToggleSelect?.(skill.name);
        } else if (!isReadOnly) {
          // Открываем модалку редактирования
          onEditClick?.(skill);
        }
      }}
    >
      {/* ЧЕКБОКС */}
      {isRemoveMode && (
        <input
          type="checkbox"
          checked={Boolean(isSelected)}
          onChange={() => onToggleSelect?.(skill.name)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-red-600 rounded border-gray-300 cursor-pointer shrink-0"
        />
      )}

      {/* ПОЛОСКА (теперь она глупая и просто рисует цвет) */}
      <div className="flex-none w-24">
        <div className={cn("w-full h-[4px] overflow-hidden relative", trackColorClass)}>
          <div
            className={cn(
              "absolute top-0 left-0 bottom-0 transition-all duration-300",
              colorClass
            )}
            style={{ width: `${(masteryLevel / 5) * 100}%` }}
          />
        </div>
      </div>

      <span className="text-gray-500 text-md font-medium truncate flex-1 min-w-0 select-none">
        {skill.name}
      </span>
    </div>
  );
}