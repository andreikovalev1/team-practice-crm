"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";

import { UPDATE_GLOBAL_CV_MUTATION } from "@/features/cvs/graphql";
import { CvForTable } from "@/features/cvs/types";

interface UpdateCVsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CvForTable | null;
}

export default function UpdateCVModal({ isOpen, onClose, cv }: UpdateCVsModalProps) {
  const [prevCvId, setPrevCvId] = useState<string | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [education, setEducation] = useState("");
  const [user, setUser] = useState("");

  if (cv?.id !== prevCvId || isOpen !== prevIsOpen) {
    setPrevCvId(cv?.id);
    setPrevIsOpen(isOpen);

    if (isOpen && cv) {
      setName(cv.name || "");
      setDescription(cv.description|| "");
      setEducation(cv.education || "");
      setUser(cv.userEmail || "");
    }
  }

  const [updateCv, { loading: isUpdating }] = useMutation(UPDATE_GLOBAL_CV_MUTATION, {
    refetchQueries: ["GetGlobalCVs"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cv || !name || !description || !education) {
      toast.error("Please fill all fields");
      return;
    }

    const loadingToast = toast.loading("Updating cv...");

    try {
      await updateCv({
        variables: {
          cv: {
            cvId: cv.id,
            name,
            description,
            education
          },
        },
      });

      toast.success("Cv updated successfully!", { id: loadingToast });
      onClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update cv";
      toast.error(msg, { id: loadingToast });
    }
  };

  const isChanged =
    cv &&
    (name !== cv.name ||
      description !== cv.description ||
      education !== cv.education);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Cv">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        <FloatingInput
          label="Cv Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating}
        />

        <FloatingInput
          label="Cv Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isUpdating}
        />

        <FloatingInput
          label="Cv Education"
          type="text"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          disabled={isUpdating}
        />

        <FloatingInput
          label="Employee"
          type="text"
          value={user}
          disabled
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