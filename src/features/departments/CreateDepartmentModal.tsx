"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";
import { CREATE_DEPARTMENT_MUTATION } from "@/features/departments/graphql";

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateDepartmentModal({
  isOpen,
  onClose,
}: CreateDepartmentModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");

  const [createDepartment, { loading: isAdding }] = useMutation(
    CREATE_DEPARTMENT_MUTATION,
    {
      refetchQueries: ["GetGlobalDepartments"],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const loadingToast = toast.loading("Creating department...");

    try {
      await createDepartment({
        variables: {
          department: {
            name,
          },
        },
      });

      toast.success("Department created successfully!", { id: loadingToast });
      setName("");

      onClose();
      router.refresh();
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to create department";
      toast.error(msg, { id: loadingToast });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Department">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingInput
          label="Department Name"
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