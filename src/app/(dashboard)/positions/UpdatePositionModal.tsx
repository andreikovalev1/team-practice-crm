"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";

import { UPDATE_POSITION_MUTATION } from "@/features/positions/graphql";
import { GlobalPosition } from "@/features/positions/types";

interface UpdatePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: GlobalPosition | null;
}

export default function UpdatePositionModal({ isOpen, onClose, position }: UpdatePositionModalProps) {
  const [prevPositionId, setPrevLPositionId] = useState<string | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const [name, setName] = useState("");

  if (position?.id !== prevPositionId || isOpen !== prevIsOpen) {
    setPrevLPositionId(position?.id);
    setPrevIsOpen(isOpen);

    if (isOpen && position) {
      setName(position.name || "");
    }
  }

  const [updatePosition, { loading: isUpdating }] = useMutation(UPDATE_POSITION_MUTATION, {
    refetchQueries: ["GetGlobalPositions"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position || !name) {
      toast.error("Please fill all fields");
      return;
    }

    const loadingToast = toast.loading("Updating position...");

    try {
      await updatePosition({
        variables: {
          position: {
            positionId: position.id,
            name,
          },
        },
      });

      toast.success("Position updated successfully!", { id: loadingToast });
      onClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update position";
      toast.error(msg, { id: loadingToast });
    }
  };

  const isChanged =
    position &&
    (name !== position.name);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Position">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        <FloatingInput
          label="Position Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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