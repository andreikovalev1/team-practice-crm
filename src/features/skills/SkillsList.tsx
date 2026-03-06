"use client";

import { ProfileSkillMastery } from "./types";
import { SkillsItem } from "./SkillsItem";

interface SkillsListProps {
  groupedSkills: Record<string, ProfileSkillMastery[]>;
  isReadOnly: boolean;
  isRemoveMode?: boolean;
  selectedSkills?: string[];
  onToggleSelect?: (name: string) => void;
  onUpdateMastery?: (name: string, categoryId: string, mastery: string) => void;
}

export function SkillsList({ 
  groupedSkills, 
  isReadOnly, 
  isRemoveMode,
  selectedSkills = [], 
  onToggleSelect,
  onUpdateMastery
}: SkillsListProps) {
  return (
    <div className="space-y-10">
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category}>
          <h3 className="text-gray-800 font-medium mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            {skills.map((skill, index) => (
              <SkillsItem 
                key={`${skill.name}-${index}`}
                skill={skill} 
                isReadOnly={isReadOnly}
                isRemoveMode={isRemoveMode}
                isSelected={selectedSkills.includes(skill.name)}
                onToggleSelect={onToggleSelect}
                onUpdateMastery={onUpdateMastery}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}