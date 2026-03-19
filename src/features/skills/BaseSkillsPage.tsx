"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { SkillsList } from "./SkillsList";
import { AddSkillModal } from "./AddSkillModal";
import { UpdateSkillModal } from "./UpdateSkillModal";
import { ProfileSkillMastery } from "./types";
import { UseSkillsLogicReturn } from "./useSkillsLogic";

interface BaseSkillsPageProps {
  logic: UseSkillsLogicReturn;
  isReadOnly: boolean;
}

export function BaseSkillsPage({ logic, isReadOnly }: BaseSkillsPageProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillToUpdate, setSkillToUpdate] = useState<ProfileSkillMastery | null>(null);
  const { 
    loading, groupedSkills, userSkillsCount, availableSkills,
    addSkill, removeSkills, updateMastery, isAdding, isDeleting
  } = logic;

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
    setSelectedSkills([]);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto mb-8 px-6 py-8">
      {userSkillsCount > 0 ? (
        <SkillsList
            groupedSkills={groupedSkills}
            isReadOnly={isReadOnly} 
            isRemoveMode={isRemoveMode}
            selectedSkills={selectedSkills}
            onToggleSelect={handleToggleSelect}
            onEditClick={setSkillToUpdate}
        />
      ) : (
        <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-lg">
          No skills added yet.
        </div>
      )}

      {!isReadOnly && (
      <div className="flex items-center justify-end gap-2 mt-16 pt-6 h-10">
        {isRemoveMode && selectedSkills.length > 0 && (
          <button 
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="sm:mr-4 px-3 sm:px-5 py-2 bg-[#C8372D] text-white rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-200 hover:bg-[#A82B22] hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:translate-y-0 disabled:opacity-50 whitespace-nowrap md:text-base"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                Delete <span className="hidden sm:inline">Selected</span> ({selectedSkills.length})
              </>
            )}
          </button>
        )}

        <button 
          onClick={() => {
              setIsAddModalOpen(true);
              setIsRemoveMode(false);
              setSelectedSkills([]);
          }}
          disabled={isRemoveMode}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 font-medium text-sm tracking-wide uppercase transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 disabled:opacity-30 whitespace-nowrap md:text-base"
        >
          <Plus size={18} /> Add <span className="hidden sm:inline">skill</span>
        </button>
        
        {userSkillsCount > 0 && (
          <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm tracking-wide uppercase transition-all duration-200 active:scale-95 md:text-base ${
                isRemoveMode ? 'text-gray-600 hover:bg-gray-100' : 'text-[#C8372D] hover:bg-red-50'
              }`}
              onClick={() => {
                setIsRemoveMode(!isRemoveMode);
                setSelectedSkills([]);
              }}
          >
              {isRemoveMode ? <X size={18} /> : <Trash2 size={18} />}
              {isRemoveMode ? (
                "Cancel"
              ) : (
                <>
                  Remove <span className="hidden sm:inline">skills</span>
                </>
              )}
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

      <UpdateSkillModal
        key={skillToUpdate?.name || "empty"} 
        isOpen={!!skillToUpdate}
        onClose={() => setSkillToUpdate(null)}
        skill={skillToUpdate}
        onUpdate={updateMastery}
      />
    </div>
  );
}