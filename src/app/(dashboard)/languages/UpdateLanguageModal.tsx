"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";

import { UPDATE_LANGUAGE_MUTATION } from "@/features/languages/graphql";
import { GlobalLanguage } from "@/features/languages/types";

interface UpdateLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: GlobalLanguage | null;
}

export default function UpdateLanguageModal({ isOpen, onClose, language }: UpdateLanguageModalProps) {
  const [prevLanguageId, setPrevLanguageId] = useState<string | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [iso2, setIso2] = useState("");

  if (language?.id !== prevLanguageId || isOpen !== prevIsOpen) {
    setPrevLanguageId(language?.id);
    setPrevIsOpen(isOpen);

    if (isOpen && language) {
      setName(language.name || "");
      setNativeName(language.native_name || "");
      setIso2(language.iso2 || "");
    }
  }

  const [updateLanguage, { loading: isUpdating }] = useMutation(UPDATE_LANGUAGE_MUTATION, {
    refetchQueries: ["GetGlobalLanguages"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!language || !name || !nativeName || !iso2) {
      toast.error("Please fill all fields");
      return;
    }

    const loadingToast = toast.loading("Updating language...");

    try {
      await updateLanguage({
        variables: {
          language: {
            languageId: language.id,
            name,
            native_name: nativeName,
            iso2,
          },
        },
      });

      toast.success("Language updated successfully!", { id: loadingToast });
      onClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update language";
      toast.error(msg, { id: loadingToast });
    }
  };

  const isChanged =
    language &&
    (name !== language.name ||
      nativeName !== language.native_name ||
      iso2 !== language.iso2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Language">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        <FloatingInput
          label="Language Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating}
          required
        />

        <FloatingInput
          label="Native Name"
          type="text"
          value={nativeName}
          onChange={(e) => setNativeName(e.target.value)}
          disabled={isUpdating}
          required
        />

        <FloatingInput
          label="ISO2"
          type="text"
          value={iso2}
          onChange={(e) => setIso2(e.target.value)}
          disabled={isUpdating}
          required
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isUpdating}
            className="w-full"
          />

          <OvalButton
            text={isUpdating ? "Updating..." : "Update"}
            type="submit"
            disabled={isUpdating || !isChanged}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}