"use client";

import { useUserStore } from "@/store/useUserStore";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export function useIsOwnProfile(explicitOwnerId?: string) {
  const { user } = useUserStore();
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const targetId = explicitOwnerId || (params?.userId as string | undefined);
  const isOwnProfile = isMounted && !!user && (
    targetId ? String(targetId) === String(user.id) : true
  );

  return {
    user,
    profileUserId: targetId,
    isOwnProfile,
  };
}