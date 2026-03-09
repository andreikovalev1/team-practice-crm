"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal"; 
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton";
import { ProfileSkillMastery } from "./types";

interface UpdateSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: ProfileSkillMastery | null;
  onUpdate: (name: string, categoryId: string, mastery: string) => Promise<void>;
  isUpdating?: boolean; 
}

const MASTERY_LEVELS = [
  { id: "Novice", name: "Novice" },
  { id: "Advanced", name: "Advanced" },
  { id: "Competent", name: "Competent" },
  { id: "Proficient", name: "Proficient" },
  { id: "Expert", name: "Expert" },
];

export function UpdateSkillModal({ 
  isOpen, 
  onClose, 
  skill, 
  onUpdate, 
  isUpdating = false 
}: UpdateSkillModalProps) {
  
  // Берем начальное значение прямо из пропса, useEffect больше не нужен!
  const [mastery, setMastery] = useState(skill?.mastery || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill || !mastery) return;

    try {
      await onUpdate(skill.name, skill.categoryId, mastery);
      onClose();
    } catch {
      // Ошибка обрабатывается в хуке
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update skill">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <FloatingSelect
          label="Skill"
          options={skill ? [{ id: skill.name, name: skill.name }] : []}
          value={skill?.name || ""}
          onChange={() => {}} 
          disabled={true} 
          required
          className="rounded-md opacity-70"
        />

        <FloatingSelect
          label="Skill mastery"
          options={MASTERY_LEVELS}
          value={mastery}
          onChange={setMastery}
          disabled={isUpdating}
          required
          className="rounded-md"
        />

        <div className="flex items-center gap-3 pt-4">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isUpdating}
            className="w-full"
          />

          <OvalButton
            text={isUpdating ? "Saving..." : "Confirm"}
            type="submit"
            disabled={isUpdating}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}