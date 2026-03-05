"use client";

import { ProfileSkillMastery } from "./types";
import { cn } from "@/lib/utils";

interface SkillsItemProps {
  skill: ProfileSkillMastery;
  isReadOnly: boolean;
  isRemoveMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (name: string) => void;
  onUpdateMastery?: (name: string, categoryId: string, mastery: string) => void;
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
  onUpdateMastery,
}: SkillsItemProps) {
  const masteryLevel = getMasteryLevel(skill.mastery);
  const colorClass = getMasteryColor(masteryLevel);
  const trackColorClass = getMasteryTrackColor(masteryLevel);

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 rounded-md transition-colors",
        isRemoveMode && "hover:bg-red-50 cursor-pointer"
      )}
      onClick={() => {
        if (isRemoveMode) {
          onToggleSelect?.(skill.name);
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

      {/* ПОЛОСКА */}
      <div className="relative flex items-center shrink-0 w-24 h-4">
        <div className={cn("w-full h-[4px] min-h-[4px] shrink-0 overflow-hidden relative", trackColorClass)}>
          <div
            className={cn(
              "absolute top-0 left-0 h-full transition-all duration-300",
              colorClass
            )}
            style={{ width: `${(masteryLevel / 5) * 100}%` }}
          />
        </div>

        {/* зоны клика работают ТОЛЬКО если не removeMode */}
        {!isReadOnly && !isRemoveMode && (
          <div className="absolute inset-0 flex">
            {levels.map((level) => (
              <div
                key={level}
                className="flex-1 h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateMastery?.(
                    skill.name,
                    skill.categoryId,
                    level
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>

      <span className="text-gray-500 text-md font-medium truncate select-none">
        {skill.name}
      </span>
    </div>
  );
}