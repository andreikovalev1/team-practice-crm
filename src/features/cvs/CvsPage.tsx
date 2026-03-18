"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useAdmin } from "@/lib/useAdmin";
import { useCvsLogic } from "./useCvsLogic";
import { CvsTable } from "./CvsTable";
import { CreateCvModal } from "./CreateCvModal";

export function CvsPage() {
  const params = useParams();
  const { isOwnProfile } = useIsOwnProfile();
  const isAdmin = useAdmin();
  const profileUserId = (params?.id || params?.userId) as string;

  const canModify = isOwnProfile || isAdmin;
  const canCreate = isOwnProfile;
  const isReadOnly = !canModify;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingInModal, setIsCreatingInModal] = useState(false);

  const {
    cvs,
    loading,
    searchTerm,
    setSearchTerm,
    sortDirection,
    handleToggleSort,
    deleteCv,
    createCv,
  } = useCvsLogic(profileUserId, "user");

  const handleCreateSubmit = async (
    name: string,
    description: string,
    education: string
  ) => {
    if (!profileUserId) return;
    setIsCreatingInModal(true);
    try {
      const newCv = await createCv(name, description, education);
      if (newCv) setIsCreateModalOpen(false);
    } finally {
      setIsCreatingInModal(false);
    }
  };

  if (!profileUserId) return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto mb-8 px-6 py-8">
      {loading ? (
        <div className="text-center py-16 text-gray-500 font-medium">
          Loading CVs...
        </div>
      ) : (
        <>
          <CvsTable
            cvs={cvs}
            isReadOnly={isReadOnly}
            userId={profileUserId}
            onDeleteClick={(cv) => deleteCv(cv.id)}
            sortDirection={sortDirection}
            onSortToggle={handleToggleSort}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCreateClick={canCreate ? () => setIsCreateModalOpen(true) : undefined}
          />

          <CreateCvModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateSubmit}
            isCreating={isCreatingInModal}
          />
        </>
      )}
    </div>
  );
}