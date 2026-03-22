"use client";

import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal";
import OvalButton from "@/components/button/OvalButton";
import { DELETE_DEPARTMENT_MUTATION } from "@/features/departments/graphql";
import { GlobalDepartment } from "@/features/departments/types";

interface DeleteDepartmentModalProps {
  department: GlobalDepartment;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteDepartmentModal({
  department,
  isOpen,
  onClose,
}: DeleteDepartmentModalProps) {
  const router = useRouter();

  const [deleteDepartment, { loading: isDeleting }] = useMutation(
    DELETE_DEPARTMENT_MUTATION,
    {
      refetchQueries: ["GetGlobalDepartments"],
    }
  );

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting department...");

    try {
      await deleteDepartment({
        variables: {
          department: {
            departmentId: department.id,
          },
        },
      });

      toast.success("Department successfully deleted", { id: loadingToast });
      onClose();
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete department";
      toast.error(message, { id: loadingToast });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete department: ${department.name}`}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed">
          Are you sure you want to delete the department:{" "}
          <span className="font-bold">{department.name}</span>?
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