"use client";

import Modal from "@/components/ui/Modal";
import OvalButton from "@/components/button/OvalButton";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

export function DeleteProjectModal({ isOpen, onClose, onConfirm, projectName }: DeleteProjectModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Delete project" 
      className="max-w-md"
    >
      <div className="flex flex-col gap-8">
        <p className="text-gray-600 leading-relaxed">
          Are you sure you want to delete project <span className="font-bold text-gray-900">{projectName}</span>?
        </p>

        <div className="w-full flex justify-end gap-3">
          <OvalButton
            text="cancel"
            variant="ovalOutline"
            onClick={onClose}
            className="w-full"
          >
            CANCEL
          </OvalButton>
          <OvalButton
            text="confirm"
            variant="oval"
            onClick={onConfirm}
            className="w-full"
          >
            CONFIRM
          </OvalButton>
        </div>
      </div>
    </Modal>
  );
}