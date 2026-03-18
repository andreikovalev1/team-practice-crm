"use client";

import { useAdmin } from "@/lib/useAdmin";
import { useCvsLogic } from "./useCvsLogic";
import { CvsTable } from "./CvsTable";
import { useSearchStore } from "@/store/useSearchStore";
import useDebounce from "@/components/search/useDebounce";
import { useMemo } from "react";

export function CvsGlobalPage() {
  const isAdmin = useAdmin();
  const search = useSearchStore((state) => state.search)
  const debouncedSearch  = useDebounce(search, 400)

  const {
    cvs,
    loading,
    searchTerm,
    setSearchTerm,
    sortDirection,
    handleToggleSort,
    deleteCv,
  } = useCvsLogic(undefined, "global");

  const displayedCvs = useMemo (() => {
      const searchValue = debouncedSearch.toLowerCase().trim()
  
      return cvs
      .filter(cv => {
        const name = cv.name.toLowerCase() || ''
        const description = cv.description.toLowerCase() || ''
        return name.includes(searchValue) || description.includes(searchValue)
      })
    }, [cvs, debouncedSearch]);

  return (
    <div className="w-full max-w-[1200px] mx-auto mb-8 px-6 py-8">
      {loading ? (
        <div className="text-center py-16 text-gray-500 font-medium">
          Loading CVs...
        </div>
      ) : (
        <CvsTable
          cvs={displayedCvs}
          isReadOnly={!isAdmin}          // только админ может удалять
          onDeleteClick={(cv) => deleteCv(cv.id)}
          sortDirection={sortDirection}
          onSortToggle={handleToggleSort}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </div>
  );
}