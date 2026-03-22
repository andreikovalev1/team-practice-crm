"use client"

import { GoArrowUp } from "react-icons/go"
import { TableProps } from "./types"
import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { usePathname } from "next/navigation"
import { useMemo } from "react";

export default function Table<T extends { id: string }>({ data, columns }: TableProps<T>) {
    const [sortField, setSortField] = useState<string | null>(null)
    const isAdmin = useAdmin();
    const pathname = usePathname()

    const visibleColumns = useMemo(() => {
        return columns.filter(col => col.key !== "actions" || isAdmin)
    }, [columns, isAdmin])

    const handleSort = (field: string) => {
        if (sortField === field) setSortField(null)
        else setSortField(field)
    }

    const sortedData = useMemo(() => {
        if (!sortField) return data

        return [...data].sort((a, b) => {
            const column = visibleColumns.find(col => String(col.key) === sortField)
            if (!column) return 0

            const valueA = column.nestedItem ? column.nestedItem(a) : a[sortField as keyof T]
            const valueB = column.nestedItem ? column.nestedItem(b) : b[sortField as keyof T]

            if (!valueA && valueB) return 1
            if (valueA && !valueB) return -1
            if (!valueA && !valueB) return 0

            return String(valueA).localeCompare(String(valueB))
        })
    }, [data, sortField, visibleColumns])

    return (
        <div className="px-6">
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    <thead>
                        <tr className="text-left">
                            {visibleColumns.map(col => (
                                <th
                                    key={String(col.key)}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                    className="px-4 py-3 font-medium cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        {col.label}
                                        {col.sortable && (
                                            <GoArrowUp className={`transition-all duration-200 ml-1 ${
                                                sortField === col.key ? "text-black" : "text-gray-400"
                                            }`} />
                                        )}
                                    </div>
                                </th>
                            ))}

                            {!isAdmin && pathname.includes('cvs') && (
                                <th className="px-4 py-3"></th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                            <td colSpan={visibleColumns.length} className="px-4 py-4">
                                No data
                            </td>
                            </tr>
                        ) : (
                            sortedData.map(item => (
                            <tr key={item.id} className="border-t border-zinc-200 hover:bg-zinc-50 dark:hover:bg-[#454545] transition">
                                {visibleColumns.map(col => (
                                <td
                                    key={`${item.id}-${String(col.key)}`}
                                    className="px-4 py-4 max-w-xs truncate overflow-hidden whitespace-nowrap"
                                >
                                    {col.nestedItem ? col.nestedItem(item) : String(item[col.key as keyof T] || '')}
                                </td>
                                ))}
                            </tr>
                            ))
                        )}
                        </tbody>

                </table>
            </div>
        </div>
    )
}