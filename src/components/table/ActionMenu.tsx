"use client";

import { useState } from "react";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ActionMenuProps<T> {
  row: T;
  entityName?: string;
  renderModal?: (row: T, close: () => void, action: string) => React.ReactNode;
}

export default function ActionMenu<T>({ row, entityName = "Item", renderModal }: ActionMenuProps<T>) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
          <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)} className="py-2.5 cursor-pointer">
            <Edit className="mr-2 h-4 w-4 text-gray-500" />
            Update {entityName}
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setIsDeleteModalOpen(true)} 
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2.5"
            >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {entityName}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isUpdateModalOpen && renderModal?.(row, () => setIsUpdateModalOpen(false), "update")}
      {isDeleteModalOpen && renderModal?.(row, () => setIsDeleteModalOpen(false), "delete")}
    </>
  );
}