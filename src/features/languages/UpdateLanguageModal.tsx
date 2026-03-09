"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton";
import { ProfileLanguage } from "./types";
import { PROFICIENCY_LEVELS } from "./constants";

interface UpdateLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: ProfileLanguage | null;
  onUpdate: (name: string, proficiency: string) => Promise<void>;
  isUpdating?: boolean;
}

export function UpdateLanguageModal({
  isOpen,
  onClose,
  language,
  onUpdate,
  isUpdating = false,
}: UpdateLanguageModalProps) {
  
  const [proficiency, setProficiency] = useState(language?.proficiency || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language || !proficiency) return;

    try {
      await onUpdate(language.name, proficiency);
      onClose();
    } catch {
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update language">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <FloatingSelect
          label="Language"
          options={language ? [{ id: language.name, name: language.name }] : []}
          value={language?.name || ""}
          onChange={() => {}} 
          disabled={true} 
          required
          className="rounded-md opacity-70"
        />

        <FloatingSelect
          label="Proficiency"
          options={PROFICIENCY_LEVELS}
          value={proficiency}
          onChange={setProficiency}
          disabled={isUpdating}
          required
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