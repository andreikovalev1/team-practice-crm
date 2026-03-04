"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useSkillsLogic } from "./useSkillsLogic";
import { SkillsList } from "./SkillsList";
import { AddSkillModal } from "./AddSkillModal";

export function SkillsPage() {
  const { profileUserId, isOwnProfile } = useIsOwnProfile();
  const isReadOnly = !isOwnProfile;
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  
  // Массив для чекбоксов
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const { 
    loading, 
    groupedSkills, 
    userSkillsCount,
    availableSkills,
    addSkill,
    removeSkills,
    updateMastery,
    isAdding,
    isDeleting
  } = useSkillsLogic(profileUserId);

  if (!profileUserId) return null;
  if (loading) return <div className="p-10 text-center text-gray-500">Loading skills...</div>;

  const handleToggleSelect = (skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) ? prev.filter(n => n !== skillName) : [...prev, skillName]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedSkills.length === 0) return;
    await removeSkills(selectedSkills);
    setIsRemoveMode(false);
    setSelectedSkills([]); // Очищаем после удаления
  };

  return (
    <div className="w-full max-w-[900px] mx-auto py-8">
      {userSkillsCount > 0 ? (
        <SkillsList
            groupedSkills={groupedSkills}
            isReadOnly={isReadOnly} 
            isRemoveMode={isRemoveMode}
            selectedSkills={selectedSkills}
            onToggleSelect={handleToggleSelect}
            onUpdateMastery={updateMastery}
        />
      ) : (
        <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
          No skills added yet.
        </div>
      )}

      {!isReadOnly && (
        <div className="flex items-center justify-end gap-6 mt-16 pt-8">
          
          {/* Кнопка Delete Selected (появляется только если выбрали чекбоксы) */}
          {isRemoveMode && selectedSkills.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="px-4 py-2 bg-[#C8372D] text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors uppercase"
            >
              {isDeleting ? "Deleting..." : `Delete Selected (${selectedSkills.length})`}
            </button>
          )}

          {/* Кнопка ADD SKILL */}
          <button 
            onClick={() => {
                setIsAddModalOpen(true);
                setIsRemoveMode(false);
                setSelectedSkills([]);
            }}
            disabled={isRemoveMode}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors text-sm tracking-wide uppercase disabled:opacity-30"
          >
            <Plus size={18} />
            Add skill
          </button>
          
          {/* Кнопка REMOVE SKILLS */}
          {userSkillsCount > 0 && (
            <button 
                className={`flex items-center gap-2 font-medium transition-colors text-sm tracking-wide uppercase ${isRemoveMode ? 'text-gray-600 hover:text-gray-900' : 'text-[#C8372D] hover:text-red-800'}`}
                onClick={() => {
                  setIsRemoveMode(!isRemoveMode);
                  setSelectedSkills([]); // Очищаем выбор при отмене
                }}
            >
                {isRemoveMode ? <X size={18} /> : <Trash2 size={18} />}
                {isRemoveMode ? "Cancel" : "Remove skills"}
            </button>
          )}
        </div>
      )}

      <AddSkillModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        availableSkills={availableSkills}
        onAdd={addSkill}
        isAdding={isAdding}
      />
    </div>
  );
}