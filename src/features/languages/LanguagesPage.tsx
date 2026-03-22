"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useLanguagesLogic } from "./useLanguagesLogic";
import { LanguagesList } from "./LanguagesList";
import { AddLanguageModal } from "./AddLanguageModal";
import { UpdateLanguageModal } from "./UpdateLanguageModal";
import { ProfileLanguage } from "./types";
import { useAdmin } from "@/lib/useAdmin";

export function LanguagesPage() {
  const { profileUserId, isOwnProfile } = useIsOwnProfile();
  const isAdmin = useAdmin();
  const isReadOnly = !isOwnProfile && !isAdmin;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageToUpdate, setLanguageToUpdate] = useState<ProfileLanguage | null>(null);

  const {
    loading,
    userLanguagesCount,
    userLanguages,
    availableLanguages,
    addLanguage,
    updateLanguage,
    removeLanguages,
    isAdding,
    isDeleting,
  } = useLanguagesLogic(profileUserId);

  if (!profileUserId) return null;
  if (loading) return <div className="p-10 text-center text-gray-500">Loading languages...</div>;

  const handleToggleSelect = (langName: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(langName) ? prev.filter((n) => n !== langName) : [...prev, langName]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedLanguages.length === 0) return;
    await removeLanguages(selectedLanguages);
    setIsRemoveMode(false);
    setSelectedLanguages([]);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto mb-8 px-6 py-8">
      
      {userLanguagesCount > 0 ? (
        <LanguagesList
          languages={userLanguages}
          isReadOnly={isReadOnly}
          isRemoveMode={isRemoveMode}
          selectedLanguages={selectedLanguages}
          onToggleSelect={handleToggleSelect}
          onEditClick={setLanguageToUpdate}
        />
      ) : (
        <div className="text-center py-10 text-gray-500 border-2 border-dashed border-zinc-700 rounded-lg">
          No languages added yet.
        </div>
      )}

      {/* КНОПКИ УПРАВЛЕНИЯ */}
      {!isReadOnly && (
        <div className="flex items-center justify-end gap-2 mt-16 pt-6 h-10">
          
          {isRemoveMode && selectedLanguages.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="sm:mr-4 px-3 sm:px-5 py-2 bg-[#C8372D] text-white rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-200 hover:bg-[#A82B22] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 disabled:opacity-50 whitespace-nowrap"
            >
              {isDeleting ? (
                "Deleting..."
              ) : (
                <>
                  Delete <span className="hidden sm:inline">Selected </span>({selectedLanguages.length})
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setIsRemoveMode(false);
              setSelectedLanguages([]);
            }}
            disabled={isRemoveMode}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 dark:text-[#757575] font-medium text-sm tracking-wide uppercase transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100 whitespace-nowrap"
          >
            <Plus size={18} />
            Add<span className="hidden sm:inline"> language</span>
          </button>

          {userLanguagesCount > 0 && (
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm tracking-wide uppercase transition-all duration-200 active:scale-95 ${
                isRemoveMode
                  ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                    : 'text-[#C8372D] hover:bg-red-50 hover:text-red-800'
              }`}
              onClick={() => {
                setIsRemoveMode(!isRemoveMode);
                setSelectedLanguages([]);
              }}
            >
              {isRemoveMode ? <X size={18} /> : <Trash2 size={18} />}
              {isRemoveMode ? (
                "Cancel"
              ) : (
                <>
                  Remove<span className="hidden sm:inline"> languages</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* МОДАЛКИ */}
      <AddLanguageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableLanguages={availableLanguages}
        onAdd={addLanguage}
        isAdding={isAdding}
      />

      <UpdateLanguageModal
        key={languageToUpdate?.name || "empty"}
        isOpen={!!languageToUpdate}
        onClose={() => setLanguageToUpdate(null)}
        language={languageToUpdate}
        onUpdate={updateLanguage}
      />
    </div>
  );
}