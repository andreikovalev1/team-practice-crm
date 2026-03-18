"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import OvalButton from "@/components/button/OvalButton";
import FloatingInput from "@/components/FloatingInput";

interface CreateCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, education: string) => Promise<void>;
  isCreating?: boolean;
}

export function CreateCvModal({ isOpen, onClose, onSubmit, isCreating }: CreateCvModalProps) {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await onSubmit(name, description, education);
    
    // Сбрасываем форму
    setName("");
    setEducation("");
    setDescription("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create CV">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
        
        <FloatingInput 
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FloatingInput 
          label="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />

        {/* Для Description используем похожую стилистику */}
        <div className="relative w-full">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder=" "
            rows={4}
            className="peer w-full border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-900 focus:border-red-700 focus:outline-none transition-colors resize-none"
          />
          <label className="absolute left-3 top-3 bg-white px-1 text-sm text-gray-500 transition-all duration-200 peer-focus:-translate-y-5 peer-not-placeholder-shown:-translate-y-5 peer-focus:text-xs peer-focus:text-red-700 peer-not-placeholder-shown:text-xs pointer-events-none">
            Description
          </label>
        </div>

        <div className="flex justify-between gap-4 mt-4">
          <OvalButton
            text="CANCEL"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isCreating}
            className="w-full border-zinc-300 text-zinc-600 hover:bg-zinc-100"
          />
          <OvalButton
            // Текст меняется ТОЛЬКО если идет реальный процесс создания
            text={isCreating ? "CREATING..." : "CREATE"}
            type="submit"
            // Кнопка блокируется, если идет загрузка ИЛИ имя пустое
            disabled={isCreating || !name.trim()}
            className={`w-full transition-colors ${
            isCreating || !name.trim() 
                ? "opacity-50 cursor-not-allowed bg-zinc-400" 
                : "bg-zinc-800 text-white hover:bg-zinc-900"
            }`}
            />
        </div>
      </form>
    </Modal>
  );
}