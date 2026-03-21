"use client"

import { useEffect, useState } from "react"
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs"
import SearchInput from "@/components/search/SearchInput"
import { useSearchStore } from "@/store/useSearchStore"
import { usePathname } from "next/navigation"
import { useAdmin } from "@/lib/useAdmin"
import { useModalStore } from "@/store/useModalStore"
import CreateUserModal from "@/features/employee/CreateUserModal"
import CreateLanguageModal from "@/features/languages/CreateLanguageModal"
import CreateSkillModal from "@/features/skills/CreateSkillModal"
import CreateGlobalPositionModal from "@/features/positions/CreatePositionModal"
import CreateDepartmentModal from "@/features/departments/CreateDepartmentModal"
import { ROUTES } from "@/app/configs/routesConfig"

  const createAllowedPaths = [
    ROUTES.HOME,
    ROUTES.SKILLS,
    ROUTES.LANGUAGES,
    ROUTES.POSITIONS,
    ROUTES.DEPARTMENTS,
    ROUTES.PROJECTS
  ];


export default function Header() {
  const search = useSearchStore((state) => state.search)
  const setSearch = useSearchStore((state) => state.setSearch)
  const pathname = usePathname()
  const isAdmin = useAdmin();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const openProjectCreate = useModalStore((state) => state.openProjectCreate)

  useEffect(() => {
    setSearch('')
  }, [pathname, setSearch])

  const showSearch = pathname ===ROUTES.HOME ||
    pathname === ROUTES.CVS ||
    pathname === ROUTES.SKILLS ||
    pathname === ROUTES.LANGUAGES ||
    pathname === ROUTES.POSITIONS ||
    pathname === ROUTES.DEPARTMENTS ||
    pathname === ROUTES.PROJECTS;
  const showCreateButton = isAdmin && createAllowedPaths.includes(pathname);

  const getCreateButtonText = () => {
    if (pathname === ROUTES.LANGUAGES) return "Create language";
    if (pathname === ROUTES.SKILLS) return "Create skill";
    if (pathname === ROUTES.POSITIONS) return "Create position"
    if (pathname === ROUTES.DEPARTMENTS) return "Create department"
    if (pathname === ROUTES.PROJECTS) return "Create project"
    return "Create user";
  };

  const handleCreateClick = () => {
    if (pathname === ROUTES.PROJECTS) {
      openProjectCreate();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-4 bg-white dark:bg-[#353535] px-6 pt-4 pb-4 flex flex-col gap-4">
        <Breadcrumbs />

          {showSearch && (
          <div className="flex justify-between items-center w-full">
            <SearchInput
              value={search}
              onChange={setSearch}
            />

            {showCreateButton && (
              <button
                onClick={handleCreateClick} 
                className="flex items-center gap-2 px-5 py-2 text-[#c53030] rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm uppercase"
              >
                <span className="text-xl leading-none mb-1">+</span>
                {getCreateButtonText()}
              </button>
            )}
          </div>
        )}
      </header>

      {isCreateModalOpen && pathname === '/' && (
        <CreateUserModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isCreateModalOpen && pathname.includes('languages') && (
        <CreateLanguageModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isCreateModalOpen && pathname.includes('skills') && (
        <CreateSkillModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isCreateModalOpen && pathname.includes('position') && (
        <CreateGlobalPositionModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}  

      {isCreateModalOpen && pathname.includes('department') && (
        <CreateDepartmentModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}  
    </>
  )
}