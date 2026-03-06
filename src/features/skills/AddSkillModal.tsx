"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal"; 
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton";
import { GlobalSkill } from "./types";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSkills: GlobalSkill[];
  onAdd: (name: string, categoryId: string, mastery: string) => Promise<void>;
  isAdding: boolean;
}

const MASTERY_LEVELS = [
  { value: "Novice", label: "Novice" },
  { value: "Advanced", label: "Advanced" },
  { value: "Competent", label: "Competent" },
  { value: "Proficient", label: "Proficient" },
  { value: "Expert", label: "Expert" },
];

export function AddSkillModal({ 
  isOpen, 
  onClose, 
  availableSkills, 
  onAdd, 
  isAdding 
}: AddSkillModalProps) {
  
  const [selectedSkillName, setSelectedSkillName] = useState("");
  const [mastery, setMastery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillName || !mastery) return;

    const skill = availableSkills.find((s) => s.name === selectedSkillName);
    if (!skill) return;

    try {
      await onAdd(skill.name, skill.category_name || "", mastery);
      setSelectedSkillName("");
      setMastery("");
      onClose();
    } catch {
    }
  };

  const skillOptions = availableSkills.map((skill) => ({
    id: skill.id,
    name: skill.name,
  }));

  const masteryOptions = MASTERY_LEVELS.map((level) => ({
    id: level.value,
    name: level.label,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add skill">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingSelect
          label="Skill"
          options={skillOptions}
          value={selectedSkillName}
          onChange={setSelectedSkillName}
          disabled={isAdding}
          required
          className="rounded-md"
        />

        <FloatingSelect
          label="Skill mastery"
          options={masteryOptions}
          value={mastery}
          onChange={setMastery}
          disabled={isAdding}
          required
          className="rounded-md"
        />

        <div className="flex items-center gap-3 pt-4">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isAdding}
            className="w-full"
          />

          <OvalButton
            text={isAdding ? "Adding..." : "Confirm"}
            type="submit"
            disabled={isAdding}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}