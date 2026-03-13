"use client";

import { useEffect } from "react";
import { updateAuthCookies } from "@/lib/utils";

interface TokenUpdaterProps {
  accessToken: string;
  refreshToken: string | null;
}

export default function TokenUpdater({ accessToken, refreshToken }: TokenUpdaterProps) {
  useEffect(() => {
    updateAuthCookies(accessToken, refreshToken);
  }, [accessToken, refreshToken]);

  return null;
}