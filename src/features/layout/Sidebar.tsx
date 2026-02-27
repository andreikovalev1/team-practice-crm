"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ROUTES } from "@/app/configs/routesConfig";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import EmployeesIcon from "@/components/icons/Employee.svg";
import SkillsIcon from "@/components/icons/Skills.svg";
import LanguagesIcon from "@/components/icons/Language.svg";
import CVsIcon from "@/components/icons/CVs.svg";

const NAV_ITEMS = [
  { name: "Employees", href: ROUTES.HOME, icon: EmployeesIcon },
  { name: "Skills", href: "/skills", icon: SkillsIcon },
  { name: "Languages", href: "/languages", icon: LanguagesIcon },
  { name: "CVs", href: "/cvs", icon: CVsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Логика инициала
  const userInitial = "R"; 

  return (
    <>
      <aside 
        className={cn(
          "hidden md:flex flex-col h-screen bg-white transition-all top-0 sticky duration-300 ease-in-out z-50",
          isCollapsed ? "w-[80px]" : "w-[200px]"
        )}
      >
        <nav className="flex-1 py-11 space-y-[14px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center py-4 transition-all duration-300 ease-in-out rounded-r-full overflow-hidden", 
                  isCollapsed ? "justify-center px-0" : "px-4",
                  isActive 
                    ? "bg-[#ECECED] text-[#2E2E2E] font-medium"
                    : "text-[#00000099] hover:bg-[#ECECED] hover:text-[#2E2E2E]"
                )}
              >
                {/* Иконка */}
                <div className={cn(
                  "w-6 h-6 shrink-0 flex items-center justify-center transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-90"
                )}>
                  <Image 
                    src={item.icon} 
                    alt={item.name} 
                    width={24} 
                    height={24} 
                    className="object-contain"
                  />
                </div>

                {/* ПЛАВНЫЙ ТЕКСТ ССЫЛКИ */}
                <span className={cn(
                  "whitespace-nowrap transition-all duration-300 ease-in-out",
                  isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[120px] opacity-100 ml-4"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          {/* ПРОФИЛЬ */}
          <div className={cn(
            "flex items-center transition-all duration-300 ease-in-out", 
            isCollapsed ? "justify-center px-0 py-2" : "px-2 py-2"
          )}>
            <div className="w-10 h-10 rounded-full bg-[#C8372D] flex items-center justify-center text-white font-medium shrink-0 text-[18px]">
              {userInitial}
            </div>
            
            {/* ПЛАВНОЕ ИМЯ ПОЛЬЗОВАТЕЛЯ */}
            <span className={cn(
              "text-md font-medium text-black truncate whitespace-nowrap transition-all duration-300 ease-in-out",
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-2"
            )}>
              Rostislav Harlanov
            </span>
          </div>

          {/* КНОПКА СО СТРЕЛКОЙ */}
          <div className={cn(
            "flex items-center py-2 transition-all duration-300 ease-in-out", 
            isCollapsed ? "justify-center px-0" : "px-2"
          )}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center w-10 h-10 transition-colors text-gray-400 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft 
                size={20} 
                className={cn(
                  "transition-transform duration-300 ease-in-out",
                  isCollapsed && "rotate-180" // Вращение стрелки на 180 градусов
                )}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Мобильное меню (оставлено без изменений) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white flex justify-between items-center px-4 py-2 z-50">
        <div className="flex gap-2 flex-1 items-center">
          {NAV_ITEMS.slice(0, 3).map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 h-10 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-black/7 text-[#2E2E2E] font-medium"
                    : "text-[#00000099] hover:bg-[#ECECED] hover:text-[#2E2E2E]"
                )}
              >
                <div className={cn("shrink-0 transition-opacity", isActive ? "opacity-100" : "opacity-90")}>
                  <Image src={item.icon} alt={item.name} width={24} height={24} />
                </div>

                <span className="hidden sm:block whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2 pl-3 shrink-0">
          <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-[#C8372D] flex items-center justify-center text-white text-lg font-medium shrink-0">
            {userInitial}
          </div>
          
          <span className="hidden sm:block text-sm font-medium text-[#2E2E2E] truncate max-w-[120px]">
            Rostislav Harlanov
          </span>
        </div>
      </nav>
    </>
  );
}