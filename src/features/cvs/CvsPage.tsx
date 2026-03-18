"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useAdmin } from "@/lib/useAdmin"; 
import { useCvsLogic } from "./useCvsLogic";
import { CvsTable } from "./CvsTable";

export function CvsPage() {
  const router = useRouter();
  const params = useParams();
  const { isOwnProfile } = useIsOwnProfile();
  const isAdmin = useAdmin();
  const profileUserId = (params?.id || params?.userId) as string;
  const canModify = isOwnProfile || isAdmin;
  const isReadOnly = !canModify;
  const canCreate = isOwnProfile;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    cvs,
    userEmail,
    loading,
    searchTerm,
    setSearchTerm,
    sortDirection,
    handleToggleSort,
    deleteCv,
    createCv,
  } = useCvsLogic(profileUserId);

  const handleCreateSubmit = async (name: string, description: string, education: string) => {
    if (!profileUserId) return;
    try {
      const newCv = await createCv(name, description, education);
      if (newCv) {
        setIsCreateModalOpen(false);
        router.push(ROUTES.CV_DETAILS(profileUserId, newCv.id));
      }
    } catch {
    }
  };

  if (!profileUserId) return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto mb-8 px-6 py-8">
      {loading ? (
        <div className="text-center py-16 text-gray-500 font-medium">Loading CVs...</div>
      ) : (
        <CvsTable
          cvs={cvs}
          userId={profileUserId}
          userEmail={userEmail || "—"}
          isReadOnly={isReadOnly}
          onDeleteClick={(cv) => deleteCv(cv.id)}
          sortDirection={sortDirection}
          onSortToggle={handleToggleSort}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateClick={canCreate ? () => setIsCreateModalOpen(true) : undefined}
        />
      )}
    </div>
  );
}