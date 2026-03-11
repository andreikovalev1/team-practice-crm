"use client";

import { useUserStore } from "@/store/useUserStore";
import { useParams } from "next/navigation";

export function useIsOwnProfile() {
  const { user } = useUserStore();
  const params = useParams();

  const profileUserId = params?.userId as string | undefined;

  const isOwnProfile = !!user && (!profileUserId || profileUserId === user.id);

  return {
    user,
    profileUserId,
    isOwnProfile,
  };
}