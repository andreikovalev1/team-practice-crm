"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton";
import { GlobalLanguage } from "./types";
import { PROFICIENCY_LEVELS } from "./constants";

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableLanguages: GlobalLanguage[];
  onAdd: (name: string, proficiency: string) => Promise<void>;
  isAdding?: boolean;
}

export function AddLanguageModal({
  isOpen,
  onClose,
  availableLanguages,
  onAdd,
  isAdding = false,
}: AddLanguageModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [proficiency, setProficiency] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLanguage || !proficiency) return;

    try {
      await onAdd(selectedLanguage, proficiency);
      setSelectedLanguage("");
      setProficiency("");
      onClose();
    } catch {
      // Ошибка уже обрабатывается в тостах хука
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add language">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingSelect
          label="Language"
          options={availableLanguages}
          value={selectedLanguage}
          onChange={setSelectedLanguage}
          disabled={isAdding}
          required
        />

        <FloatingSelect
          label="Proficiency"
          options={PROFICIENCY_LEVELS}
          value={proficiency}
          onChange={setProficiency}
          disabled={isAdding}
          required
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