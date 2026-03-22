"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ROUTES } from "@/app/configs/routesConfig";
import { cn } from "@/lib/utils";
import { ChevronLeft, LogOut, User as UserIcon } from "lucide-react";
import { IoSettingsOutline } from "react-icons/io5";
import { useUserStore } from "@/store/useUserStore";
import { useAdmin } from "@/lib/useAdmin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/features/layout/navItemsConfig";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isAdmin = useAdmin();
  const theme = useSettingsStore((state) => state.theme);

  const navItems = NAV_ITEMS(theme === "dark");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { user, logout } = useUserStore();

  const firstName = user?.profile?.first_name || "User";
  const lastName = user?.profile?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const userInitial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    if (logout) logout();
    router.push('/auth/login');
  };

  const visibleNavItems = navItems.filter(item => {
    if (item.isAdminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <TooltipProvider delayDuration={300}>
      <aside 
        className={cn(
          "hidden md:flex flex-col h-screen  transition-all top-0 sticky duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : "w-[200px]"
        )}
      >
        <nav className="flex-1 py-11 space-y-[14px]">
          {visibleNavItems.map((item) => {
            const path = item.href;
            const isActive = pathname === path;
            return (
              <Link
                key={item.name}
                href={path}
                className={cn(
                  "flex items-center py-4 transition-all ease-in-out rounded-r-full overflow-hidden", 
                  isCollapsed ? "justify-center px-0" : "px-4",
                  isActive 
                    ? "bg-[#ECECED] text-[#2E2E2E] font-medium transition-all ease-in-out dark:bg-[#454545] dark:text-[#ECECED]"
                    : "text-[#00000099] hover:bg-[#ECECED] hover:text-[#2E2E2E] dark:text-[#ECECED] dark:hover:bg-[#454545]"
                )}
              >
                <div className={cn(
                  "w-6 h-6 shrink-0 flex items-center justify-center transition-opacity",
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

                <span className={cn(
                  "whitespace-nowrap transition-all ease-in-out",
                  isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[120px] opacity-100 ml-4"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          {!isMounted ? (
            <div className={cn(
              "flex items-center w-full focus:outline-none transition-all duration-300 ease-in-out", 
              isCollapsed ? "justify-center px-0 py-2" : "px-2 py-2 text-left"
            )}>
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
              {!isCollapsed && <div className="ml-2 w-24 h-4 bg-gray-200 rounded animate-pulse" />}
            </div>
          ) : (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(
                      "flex items-center w-full focus:outline-none transition-all duration-300 ease-in-out hover:bg-gray-50 dark:text-[#ECECED] dark:hover:bg-[#454545]", 
                      isCollapsed ? "justify-center px-0 py-2" : "px-2 py-2 text-left"
                    )}>
                      <div className="relative w-10 h-10 rounded-full bg-[#C8372D] flex items-center justify-center text-white font-medium shrink-0 text-[18px] overflow-hidden">
                        {user?.profile?.avatar ? (
                          <Image 
                            src={user.profile.avatar} 
                            alt={fullName} 
                            fill 
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          userInitial
                        )}
                      </div>
                      
                      <span className={cn(
                        "text-md font-medium text-black truncate whitespace-nowrap transition-all duration-300 ease-in-out dark:text-[#ECECED]",
                        isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[150px] opacity-100 ml-2"
                      )}>
                        {fullName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                
                {!isCollapsed && (
                  <TooltipContent side="right" className="z-50 bg-black text-white px-3 py-1.5 text-sm rounded-md shadow-md">
                    <p>{fullName}</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <DropdownMenuContent side="right" align="end" className="w-56 mb-2 ml-2 rounded-xl">
                <div className="flex items-center gap-2 p-2">
                  <div className="relative w-8 h-8 rounded-full bg-[#C8372D] flex items-center justify-center text-white font-medium shrink-0 overflow-hidden">
                    {user?.profile?.avatar ? (
                      <Image src={user.profile.avatar} alt={fullName} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-xs">{userInitial}</span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{fullName}</p>
                    <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                  <Link href={user?.id ? ROUTES.PROFILE(user.id) : "#"} className="w-full">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                  <Link href={ROUTES.SETTINGS} className="w-full">
                    <IoSettingsOutline className="mr-2 h-4 w-4"/>
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className={cn(
            "flex items-center py-2 transition-all duration-300 ease-in-out", 
            isCollapsed ? "pl-5" : "pl-2"
          )}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center w-10 h-10 transition-colors text-gray-400 hover:bg-gray-100 dark:hover:bg-[#454545] rounded-lg"
            >
              <ChevronLeft 
                size={20} 
                className={cn(
                  "transition-transform duration-300 ease-in-out",
                  isCollapsed && "rotate-180" 
                )}
              />
            </button>
          </div>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#353535] flex justify-between items-center px-4 py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex gap-2 flex-1 items-center">
          {visibleNavItems.slice(0, 3).map((item) => {
            const path = item.href;
            const isActive = pathname === path;
            
            return (
              <Link
                key={item.name}
                href={path}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 h-10 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-black/7 text-[#2E2E2E] font-medium dark:bg-[#454545] dark:text-[#ECECED]"
                    : "text-[#00000099] hover:bg-[#ECECED] hover:text-[#2E2E2E] dark:text-[#ECECED] dark:hover:bg-[#454545]"
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
        
        {!isMounted ? (
          <div className="flex items-center gap-2 pl-3 shrink-0">
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-3 shrink-0 focus:outline-none cursor-pointer">
                <div className="relative w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-[#C8372D] flex items-center justify-center text-white text-lg font-medium shrink-0 overflow-hidden">
                    {user?.profile?.avatar ? (
                      <Image 
                        src={user.profile.avatar} 
                        alt={fullName} 
                        fill 
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      userInitial
                    )}
                </div>
                
                <span className="hidden sm:block text-sm font-medium text-[#2E2E2E] truncate max-w-[120px] dark:text-[#ECECED]">
                  {fullName}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="end" className="w-56 mb-2 mr-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 p-2">
                <div className="relative w-8 h-8 rounded-full bg-[#C8372D] flex items-center justify-center text-white font-medium shrink-0 overflow-hidden">
                  {user?.profile?.avatar ? (
                    <Image src={user.profile.avatar} alt={fullName} fill className="object-cover" unoptimized />
                  ) : (
                    <span className="text-xs">{userInitial}</span>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{fullName}</p>
                  <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                <Link href={user?.id ? ROUTES.PROFILE(user.id) : "#"} className="w-full">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                <Link href={ROUTES.SETTINGS} className="w-full">
                  <IoSettingsOutline className="mr-2 h-4 w-4"/>
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

      </nav>
    </TooltipProvider>
  );
}