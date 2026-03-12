"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVertical, User as UserIcon, Trash2, Edit } from "lucide-react";
import { ROUTES } from "@/app/configs/routesConfig";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal"; 
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client/react";
import { User } from "@/types/user.types";
import { DELETE_USER_MUTATION } from "./graphql";
import UpdateModal from "./UpdateModal";
import OvalButton from "@/components/button/OvalButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminActionMenuProps {
  employee: User;
}

export default function AdminActionMenu({ employee }: AdminActionMenuProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [deleteUser, { loading: isDeleting }] = useMutation(DELETE_USER_MUTATION, {
    refetchQueries: ["GetUsers"],
  });

  const handleDelete = async () => {
    const loadingToast = toast.loading("Deleting user...");
    try {
      await deleteUser({ variables: { userId: employee.id } });
      toast.success("User successfully deleted", { id: loadingToast });
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete user";
      toast.error(message, { id: loadingToast });
    }
  };

  const fullName = `${employee.profile?.first_name || ""} ${employee.profile?.last_name || ""}`.trim();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
          <DropdownMenuItem asChild className="cursor-pointer py-2.5">
            <Link href={ROUTES.PROFILE(employee.id)} className="flex items-center w-full">
              <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
              <span>User profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setIsUpdateModalOpen(true)} 
            className="cursor-pointer py-2.5"
          >
            <Edit className="mr-2 h-4 w-4 text-gray-500" />
            <span>Update user</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={() => setIsDeleteModalOpen(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete user</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isUpdateModalOpen && (
        <UpdateModal 
          isOpen={isUpdateModalOpen} 
          onClose={() => setIsUpdateModalOpen(false)} 
          user={employee} 
        />
      )}

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Delete User"
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-600 text-sm leading-relaxed flex justify-start">
            Are you sure you want to delete <span className="font-semibold text-black ml-1">{fullName || employee.email}</span>?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
            <OvalButton
              text="Cancel"
              type="button"
              variant="ovalOutline"
              onClick={() => setIsDeleteModalOpen(false)}
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
    </>
  );
}