"use client";

import { useState } from "react";
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

export function AddSkillModal({ isOpen, onClose, availableSkills, onAdd, isAdding }: AddSkillModalProps) {
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [mastery, setMastery] = useState("Novice");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    // Находим полный объект скилла, чтобы достать его name и categoryId
    const skill = availableSkills.find(s => s.id === selectedSkillId);
    if (!skill) return;

    try {
      await onAdd(skill.name, skill.category_name || "", mastery);
      // Очищаем форму и закрываем модалку после успеха
      setSelectedSkillId("");
      setMastery("Novice");
      onClose();
    } catch{
      // Ошибка уже обработана тостом в хуке
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-medium text-gray-900 mb-6">Add New Skill</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Выбор навыка */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Skill</label>
            <select
              required
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              disabled={isAdding}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#C8372D] transition-colors bg-white"
            >
              <option value="" disabled>-- Choose a skill --</option>
              {availableSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Выбор уровня */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mastery Level</label>
            <select
              value={mastery}
              onChange={(e) => setMastery(e.target.value)}
              disabled={isAdding}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#C8372D] transition-colors bg-white"
            >
              {MASTERY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isAdding}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSkillId || isAdding}
              className="px-4 py-2 bg-[#C8372D] text-white font-medium rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAdding ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}