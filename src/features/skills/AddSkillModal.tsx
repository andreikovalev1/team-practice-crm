"use client";

import { useState, useEffect } from "react";
import { GlobalSkill } from "./types";
import { X } from "lucide-react";
import OvalButton from "@/components/button/OvalButton"; 
import FloatingSelect from "@/components/FloatingSelect"; 

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

export function AddSkillModal({ isOpen, onClose, availableSkills, onAdd, isAdding }: AddSkillModalProps) {

  const [selectedSkillName, setSelectedSkillName] = useState("");
  const [mastery, setMastery] = useState(""); 

    useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillName || !mastery) return;

    const skill = availableSkills.find(s => s.name === selectedSkillName);
    if (!skill) return;

    try {
      await onAdd(skill.name, skill.category_name || "", mastery);
      setSelectedSkillName("");
      setMastery("");
      onClose();
    } catch {
    }
  };

  const skillOptions = availableSkills.map(skill => ({
    id: skill.id,
    name: skill.name
  }));

  const masteryOptions = MASTERY_LEVELS.map(level => ({
    id: level.value,
    name: level.label
  }));

  return (
    <div className="fixed inset-0 z-5 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Add skill</h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
        
          <FloatingSelect
            label="Skill"
            options={skillOptions}
            value={selectedSkillName}
            onChange={(value) => setSelectedSkillName(value)}
            disabled={isAdding}
            required
            className="rounded-md"
          />

          <FloatingSelect
            label="Skill mastery"
            options={masteryOptions}
            value={mastery}
            onChange={(value) => setMastery(value)}
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
                className="w-full"
            />
            
            <div className="w-full">
               <OvalButton text={isAdding ? "Adding..." : "Confirm"} />
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}