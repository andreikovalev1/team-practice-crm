"use client";

import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useAdmin } from "@/lib/useAdmin";
import { useSkillsLogic } from "./useSkillsLogic";
import { BaseSkillsPage } from "./BaseSkillsPage";

export function SkillsPage() {
  const { profileUserId, isOwnProfile } = useIsOwnProfile();
  const isAdmin = useAdmin();
  const logic = useSkillsLogic(profileUserId);
  
  if (!profileUserId) return null;

  return (
    <BaseSkillsPage 
      logic={logic} 
      isReadOnly={!isOwnProfile && !isAdmin} 
    />
  );
}