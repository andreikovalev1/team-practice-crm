"use client"

import { useState } from "react"
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs"
import SearchInput from "@/components/search/SearchInput"
import { useSearchStore } from "@/store/useSearchStore"
import { usePathname } from "next/navigation"
import { useAdmin } from "@/lib/useAdmin" 
import CreateUserModal from "@/features/employee/CreateUserModal"
import UpdateModal from "@/features/employee/UpdateModal"
import { useUserStore } from "@/store/useUserStore"

export default function Header() {
  const search = useSearchStore((state) => state.search)
  const setSearch = useSearchStore((state) => state.setSearch)
  const pathname = usePathname()
  const isAdmin = useAdmin();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { user } = useUserStore();

  const showSearch = pathname === "/" || pathname.includes('cvs');

  return (
    <>
      <header className="sticky top-0 z-4 bg-white px-6 pt-4 pb-4 flex flex-col gap-4">
        <Breadcrumbs />

          {showSearch && (
          <div className="flex justify-between items-center w-full">
            <SearchInput
              value={search}
              onChange={setSearch}
            />

            {isAdmin && (
              <button
                onClick={() => setIsCreateModalOpen(true)} 
                className="flex items-center gap-2 px-5 py-2 text-[#c53030] rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm uppercase"
              >
                <span className="text-xl leading-none mb-1">+</span> Create user
              </button>
            )}
          </div>
        )}
      </header>

      {isCreateModalOpen && (
        <CreateUserModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isUpdateModalOpen && user && (
        <UpdateModal 
          isOpen={isUpdateModalOpen} 
          onClose={() => setIsUpdateModalOpen(false)} 
          user={user}
        />
      )}
    </>
  )
}