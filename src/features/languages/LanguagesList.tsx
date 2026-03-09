"use client";

import { ProfileLanguage } from "./types";
import { LanguageItem } from "./LanguageItem";

interface LanguagesListProps {
  languages: ProfileLanguage[];
  isReadOnly: boolean;
  isRemoveMode?: boolean;
  selectedLanguages?: string[];
  onToggleSelect?: (name: string) => void;
  onEditClick?: (language: ProfileLanguage) => void;
}

export function LanguagesList({
  languages,
  isReadOnly,
  isRemoveMode,
  selectedLanguages = [],
  onToggleSelect,
  onEditClick,
}: LanguagesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
      {languages.map((lang, index) => (
        <LanguageItem
          key={`${lang.name}-${index}`}
          language={lang}
          isReadOnly={isReadOnly}
          isRemoveMode={isRemoveMode}
          isSelected={selectedLanguages.includes(lang.name)}
          onToggleSelect={onToggleSelect}
          onEditClick={onEditClick}
        />
      ))}
    </div>
  );
}