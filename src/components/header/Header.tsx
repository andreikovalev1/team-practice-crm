"use client"

import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs"
import SearchInput from "@/components/search/SearchInput"
import { useSearchStore } from "@/store/useSearchStore"
import { usePathname } from "next/navigation"

export default function Header() {
  const search = useSearchStore((state) => state.search)
  const setSearch = useSearchStore((state) => state.setSearch)
  const pathname = usePathname()

  const showSearch = pathname === "/" || pathname.includes('/') && pathname.includes('cvs')

  return (
    <header className="sticky top-0 z-4 bg-white px-6 pt-4 pb-4 flex flex-col gap-4">
      <Breadcrumbs />

        {showSearch && 
            <SearchInput
                value={search}
                onChange={setSearch}
            />
        }
    </header>
  )
}