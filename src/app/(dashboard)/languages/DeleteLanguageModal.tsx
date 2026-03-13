"use client";

import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";
import OvalButton from "@/components/button/OvalButton";
import { DELETE_LANGUAGE_MUTATION } from "@/features/languages/graphql";
import { GlobalLanguage } from "@/features/languages/types";

interface DeleteLanguageModalProps {
  language: GlobalLanguage;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteLanguageModal({ language, isOpen, onClose }: DeleteLanguageModalProps) {
  const router = useRouter();
  const [deleteSkill, { loading: isDeleting }] = useMutation(DELETE_LANGUAGE_MUTATION, {
    refetchQueries: ["GetGlobalLanguages"],
  });

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting language...");
    try {
      await deleteSkill({ variables: { language: { languageId: language.id } } });
      toast.success("Language successfully deleted", { id: loadingToast });
      onClose();
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete language";
      toast.error(message, { id: loadingToast });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete language: ${language.name}`}>
      <div className="flex flex-col gap-4">
        <p className="text-red-600 text-sm leading-relaxed">
          Are you sure you want to delete the language: <span className="font-semibold">{language.name}</span>?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full"
          />
          <OvalButton
            text={isDeleting ? "Deleting..." : "Delete"}
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full"
          />
        </div>
      </div>
    </Modal>
  );
}