"use client";

import { useState, useEffect } from "react";
import { checkIsAdminToken } from "@/lib/utils";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true; 

    const checkRole = () => {
      const result = checkIsAdminToken();
      if (isMounted) {
        setIsAdmin(result);
      }
    };

    checkRole();

    return () => {
      isMounted = false;
    };
  }, []);

  return isAdmin;
};