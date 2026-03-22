"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";

import { UPDATE_DEPARTMENT_MUTATION } from "@/features/departments/graphql";
import { GlobalDepartment } from "@/features/departments/types";

interface UpdateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: GlobalDepartment | null;
}

export default function UpdateDepartmentModal({
  isOpen,
  onClose,
  department,
}: UpdateDepartmentModalProps) {
  const [prevDepartmentId, setPrevDepartmentId] = useState<string | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const [name, setName] = useState("");

  if (department?.id !== prevDepartmentId || isOpen !== prevIsOpen) {
    setPrevDepartmentId(department?.id);
    setPrevIsOpen(isOpen);

    if (isOpen && department) {
      setName(department.name || "");
    }
  }

  const [updateDepartment, { loading: isUpdating }] = useMutation(
    UPDATE_DEPARTMENT_MUTATION,
    {
      refetchQueries: ["GetGlobalDepartments"],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!department || !name) {
      toast.error("Please fill all fields");
      return;
    }

    const loadingToast = toast.loading("Updating department...");

    try {
      await updateDepartment({
        variables: {
          department: {
            departmentId: department.id,
            name,
          },
        },
      });

      toast.success("Department updated successfully!", { id: loadingToast });
      onClose();
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to update department";
      toast.error(msg, { id: loadingToast });
    }
  };

  const isChanged = department && name !== department.name;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Department">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        <FloatingInput
          label="Department Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating}
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