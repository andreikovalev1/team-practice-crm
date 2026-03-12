"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";
import { CREATE_LANGUAGE_MUTATION } from "./graphql";

interface CreateGlobalLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGlobalLanguageModal({ isOpen, onClose }: CreateGlobalLanguageModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [iso2, setIso2] = useState("");
  const [createLanguage, { loading: isAdding }] = useMutation(CREATE_LANGUAGE_MUTATION, {
    refetchQueries: ["GetGlobalLanguages"], 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !iso2) return;

    const loadingToast = toast.loading("Creating language...");

    try {
      await createLanguage({
        variables: {
          language: {
            name: name,
            native_name: nativeName,
            iso2: iso2,
          }
        }
      });

      toast.success("Language created successfully!", { id: loadingToast });
      setName("");
      setNativeName("");
      setIso2("");
      
      onClose();
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create language";
      toast.error(msg, { id: loadingToast });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Language">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingInput
          label="Language Name (e.g., English)"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isAdding}
          required
        />
        <FloatingInput
          label="Native Name (e.g., English)"
          type="text"
          value={nativeName}
          onChange={(e) => setNativeName(e.target.value)}
          disabled={isAdding}
        />
        <FloatingInput
          label="ISO2 Code (e.g., en)"
          type="text"
          value={iso2}
          onChange={(e) => setIso2(e.target.value)}
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
            text={isAdding ? "Creating..." : "Create"}
            type="submit"
            disabled={isAdding || !name || !iso2}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}