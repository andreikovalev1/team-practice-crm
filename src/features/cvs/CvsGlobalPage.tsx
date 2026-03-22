"use client";

import { useAdmin } from "@/lib/useAdmin";
import { useCvsLogic } from "./useCvsLogic";
import { CvsTable } from "./CvsTable";
import { useSearchStore } from "@/store/useSearchStore";
import useDebounce from "@/components/search/useDebounce";
import { useMemo, useState } from "react";
import { CvForTable, GlobalCVs } from "./types";
import UpdateCVModal from "./UpdateCvModal";
import DeleteCvModal from "./DeleteCvModal"

export function CvsGlobalPage() {
  const isAdmin = useAdmin();
  const search = useSearchStore((state) => state.search)
  const debouncedSearch  = useDebounce(search, 400)
  const [selectedCv, setSelectedCv] = useState<GlobalCVs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    cvs,
    loading,
    sortDirection,
    handleToggleSort,
    deleteCv
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

    const handleUpdateClick = (cv: CvForTable) => {
      setSelectedCv(cv as GlobalCVs);
      setIsModalOpen(true);
    };

  return (
    <div className="w-full max-w-[1200px] mx-auto mb-8 px-6 py-8">
      {loading ? (
        <div className="text-center py-16 text-gray-500 font-medium">
          Loading CVs...
        </div>
      ) : (
      <>
        <CvsTable
          cvs={displayedCvs}
          isReadOnly={!isAdmin}
          onDeleteClick={(cv) => deleteCv(cv.id)}
          sortDirection={sortDirection}
          onSortToggle={handleToggleSort}
          onUpdateClick={handleUpdateClick}
        />

        <UpdateCVModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cv={selectedCv}
        />

        {selectedCv && (
          <DeleteCvModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            cv={selectedCv}
          />
        )}
      </>
      )}
    </div>
  );
}