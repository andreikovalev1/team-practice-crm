"use client";

import { BaseSkillsPage } from "@/features/skills/BaseSkillsPage";
import { useCvSkillsLogic } from "./useCvSkillsLogic";

interface CvSkillsContainerProps {
  cvId: string;
}

export function CvSkillsContainer({ cvId }: CvSkillsContainerProps) {
  const logic = useCvSkillsLogic(cvId);
  return (
    <BaseSkillsPage 
      logic={logic} 
      isReadOnly={false} 
    />
  );
}