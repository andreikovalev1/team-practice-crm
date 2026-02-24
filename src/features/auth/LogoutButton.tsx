'use client'

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/app/configs/routesConfig"

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    document.cookie = "auth_token=; path=/; max-age=0";
    router.push(ROUTES.LOGIN);
  };

  return (
    <Button onClick={handleLogout} variant="destructive" className="mt-8">
      Выйти из аккаунта
    </Button>
  );
}