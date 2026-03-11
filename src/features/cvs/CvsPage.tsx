"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useCvsLogic } from "./useCvsLogic";
import { CvsTable } from "./CvsTable";
//import { CreateCvModal } from "./CreateCvModal";

export function CvsPage() {
  const router = useRouter();
  const { profileUserId, isOwnProfile, user } = useIsOwnProfile();
  
  // Проверяем права (админ может всё, как описано в AC-7)
  //const isAdmin = user?.role === "admin" || user?.role === "ADMIN";
  const isReadOnly = !isOwnProfile; // && !isAdmin;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Достаем всё из нашего умного хука
  const {
    cvs,
    loading,
    searchTerm,
    setSearchTerm,
    sortDirection,
    handleToggleSort,
    deleteCv,
    createCv,
    isCreating,
  } = useCvsLogic(profileUserId);

  // Хэндлер: Создаем CV и сразу прыгаем внутрь него (на таб Details)
  const handleCreateSubmit = async (name: string, description: string, education: string) => {
    if (!profileUserId) return;
    const newCv = await createCv(name, description, education);
    if (newCv) {
      router.push(ROUTES.CV_DETAILS(profileUserId, newCv.id));
    }
  };

  if (!profileUserId) return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto mb-8 px-6 py-8">
      
      {/* ВЕРХНЯЯ ПАНЕЛЬ: Поиск и кнопка создания */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        {/* Строка поиска */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search CVs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
          />
        </div>

        {/* Кнопка создания (Скрыта, если Read-Only) */}
        {!isReadOnly && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-[#C8372D] font-medium text-sm tracking-wide uppercase transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} />
            Create CV
          </button>
        )}
      </div>

      {/* ТАБЛИЦА */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading CVs...</div>
      ) : (
        <CvsTable
          cvs={cvs}
          userId={profileUserId}
          userEmail={user?.email || "Unknown"}
          isReadOnly={isReadOnly}
          onDeleteClick={(cv) => deleteCv(cv.id)}
          sortDirection={sortDirection}
          onSortToggle={handleToggleSort}
        />
      )}

      {/* МОДАЛКА */}
      {/* <CreateCvModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateSubmit}
        isCreating={isCreating}
      /> */}
    </div>
  );
}