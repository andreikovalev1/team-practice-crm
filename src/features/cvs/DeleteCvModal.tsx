"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";
import OvalButton from "@/components/button/OvalButton";
import { DELETE_CV_MUTATION } from "@/features/cvs/graphql";
import { Cv } from "@/features/cvs/types";

interface DeleteCvModalProps {
  cv: Cv;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteCvModal({ cv, isOpen, onClose }: DeleteCvModalProps) {
  const router = useRouter();

  const [deleteCv, { loading: isDeleting }] = useMutation(DELETE_CV_MUTATION, {
    refetchQueries: ["GetCVs"],
  });

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Deleting CV...");

    try {
      await deleteCv({
        variables: { cvId: cv.id },
      });

      toast.success("CV successfully deleted", { id: loadingToast });

      onClose();
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete CV";
      toast.error(message, { id: loadingToast });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete CV: ${cv.name}`}
    >
      <form onSubmit={handleDelete} className="flex flex-col gap-6 mt-6">
        <p className="text-sm leading-relaxed">
          Are you sure you want to delete CV:{" "}
          <span className="font-bold">{cv.name}</span>?
        </p>

        <div className="flex justify-between gap-4 mt-4">
          <OvalButton
            text="CANCEL"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full"
          />
          <OvalButton
            text={isDeleting ? "DELETING..." : "DELETE"}
            type="submit"
            disabled={isDeleting}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}