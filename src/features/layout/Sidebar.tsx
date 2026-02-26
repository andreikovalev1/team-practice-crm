"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import { cn } from "@/lib/utils";
import LogoutButton from "@/features/auth/LogoutButton";

// Замени эти заглушки на импорты своих иконок из папки icons, когда скачаешь их из Figma
import { Users, TrendingUp, Languages, FileText } from "lucide-react"; 

const NAV_ITEMS = [
  { name: "Employees", href: ROUTES.HOME, icon: Users, hideOnMobile: false },
  { name: "Skills", href: "/skills", icon: TrendingUp, hideOnMobile: false },
  { name: "Languages", href: "/languages", icon: Languages, hideOnMobile: false },
  { name: "CVs", href: "/cvs", icon: FileText, hideOnMobile: true }, 
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ---------------- ДЕСКТОПНЫЙ SIDEBAR ---------------- */}
      <aside className="hidden md:flex flex-col w-[200px] h-screen bg-[#F7F7F8] border-r border-gray-200 sticky top-0">
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-white text-black font-medium shadow-sm" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-black"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-gray-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Профиль пользователя внизу (как на 1-м макете) */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-medium shrink-0">
            R
          </div>
          <span className="text-sm font-medium truncate text-black">Rostislav Harlanov</span>
        </div>
      </aside>


      {/* ---------------- МОБИЛЬНОЕ НИЖНЕЕ МЕНЮ ---------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#F7F7F8] border-t border-gray-200 flex justify-around items-center px-2 py-2 z-50">
        {NAV_ITEMS.map((item) => {
          if (item.hideOnMobile) return null; // Скрываем CVs на мобилке
          
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors",
                isActive 
                  ? "bg-white text-black font-medium shadow-sm" 
                  : "text-gray-500 hover:text-black"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-gray-500")} />
              {/* Показываем текст только у активного элемента (как на 3-м макете) */}
              {isActive && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </>
  );
}