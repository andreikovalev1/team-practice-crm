"use client";

import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";
import OvalButton from "@/components/button/OvalButton";
import { DELETE_POSITION_MUTATION } from "@/features/positions/graphql";
import { GlobalPosition } from "@/features/positions/types";

interface DeletePositionModalProps {
  position: GlobalPosition;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeletePositionModal({ position, isOpen, onClose }: DeletePositionModalProps) {
  const router = useRouter();
  const [deletePosition, { loading: isDeleting }] = useMutation(DELETE_POSITION_MUTATION, {
    refetchQueries: ["GetGlobalPositions"],
  });

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting language...");
    try {
      await deletePosition({ variables: { position: { positionId: position.id } } });
      toast.success("Position successfully deleted", { id: loadingToast });
      onClose();
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete position";
      toast.error(message, { id: loadingToast });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete language: ${position.name}`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed">
          Are you sure you want to delete the position: <span className="font-bold">{position.name}</span>?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-3 w-full">
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