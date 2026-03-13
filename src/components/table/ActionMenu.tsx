"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ActionMenuProps<T> {
  row: T;
  renderModal?: (row: T, close: () => void, action: string) => React.ReactNode;
}

export default function ActionMenu<T>({ row, renderModal }: ActionMenuProps<T>) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const pathname = usePathname();

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
            Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="py-2.5 text-red-600 cursor-pointer">
            Delete
          </DropdownMenuItem>

          {pathname.includes("/cvs") && (
            <DropdownMenuItem className="py-2.5 text-blue-600 cursor-pointer">
                <Link href='#' className="text-blue-600 underline">
                    Перейти на CV
                </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Модалки */}
      {isUpdateModalOpen && renderModal?.(row, () => setIsUpdateModalOpen(false), "update")}
      {isDeleteModalOpen && renderModal?.(row, () => setIsDeleteModalOpen(false), "delete")}
    </>
  );
}