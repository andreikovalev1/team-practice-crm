"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";
import { CREATE_POSITION_MUTATION } from "./graphql";

interface CreateGlobalPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGlobalPositionModal({ isOpen, onClose }: CreateGlobalPositionModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [createPosition, { loading: isAdding }] = useMutation(CREATE_POSITION_MUTATION, {
    refetchQueries: ["GetGlobalPositions"], 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const loadingToast = toast.loading("Creating position...");

    try {
      await createPosition({
        variables: {
          position: {
            name: name,
          }
        }
      });

      toast.success("Position created successfully!", { id: loadingToast });
      setName("");

      onClose();
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create position";
      toast.error(msg, { id: loadingToast });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create position">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingInput
          label="Position Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            disabled={isAdding || !name}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}