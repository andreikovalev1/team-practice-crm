"use client"

import { GoArrowUp } from "react-icons/go"
import { TableProps } from "./types"
import { useState } from "react";
import { useAdmin } from "@/lib/useAdmin";
import { MdArrowForwardIos } from "react-icons/md"
import Link from "next/link";
import { usePathname } from "next/navigation"

export default function Table<T extends { id: string }>({ data, columns }: TableProps<T>) {
    const [sortField, setSortField] = useState<string | null>(null)
    const isAdmin = useAdmin();
    const pathname = usePathname();

    if (!data || data.length === 0) return <div className="px-6">No data</div>

    // Фильтруем колонки: actions видны только админам
    const visibleColumns = columns.filter(col => col.key !== 'actions' || isAdmin)

    const handleSort = (field: string) => {
        if (sortField === field) setSortField(null)
        else setSortField(field)
    }

    // Сортировка по visibleColumns
    const sortedData = [...data].sort((a, b) => {
        if (!sortField) return 0

        const column = visibleColumns.find(col => String(col.key) === sortField)
        if (!column) return 0

        const valueA = column.nestedItem ? column.nestedItem(a) : a[sortField as keyof T]
        const valueB = column.nestedItem ? column.nestedItem(b) : b[sortField as keyof T]

        if (!valueA && valueB) return 1
        if (valueA && !valueB) return -1
        if (!valueA && !valueB) return 0

        return String(valueA).localeCompare(String(valueB))
    })

    return (
        <div className="px-6">
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    {/* HEAD */}
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

                            {/* Колонка для обычного пользователя на /cvs */}
                            {!isAdmin && pathname.includes('cvs') && (
                                <th className="px-4 py-3"></th>
                            )}
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {sortedData.map(item => (
                            <tr
                                key={item.id}
                                className="border-t border-zinc-200 hover:bg-zinc-50 transition"
                            >
                                {visibleColumns.map(col => (
                                    <td
                                        key={`${item.id}-${String(col.key)}`}
                                        className="px-4 py-4 max-w-xs truncate overflow-hidden whitespace-nowrap"
                                    >
                                        {col.nestedItem
                                            ? col.nestedItem(item)
                                            : col.key in item
                                                ? String(item[col.key as keyof T])
                                                : null
                                        }
                                    </td>
                                ))}

                                {/* Колонка с переходом для обычного пользователя на /cvs */}
                                {!isAdmin && pathname.includes('cvs') && (
                                    <td className="px-4 py-4">
                                        <Link
                                            href={`/cvs/${item.id}`}
                                            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black transition-colors"
                                        >
                                            <MdArrowForwardIos size={14} />
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}