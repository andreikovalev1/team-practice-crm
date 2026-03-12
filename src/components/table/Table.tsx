"use client"

import { GoArrowUp } from "react-icons/go"
import { CiMenuKebab } from "react-icons/ci"
import { TableProps } from "./types"
import { useState } from "react";

export default function Table<T extends { id: string }>({ data, columns }: TableProps<T>) {
    const [sortField, setSortField] = useState<string | null>(null)

    if (!data || data.length === 0) return <div className="px-6">No data</div>

    const handleSort = (field: string) => {
        if (sortField === field) {
        setSortField(null)
        } else {
        setSortField(field)
        }
    }

    const sortedData = [...data].sort((a, b) => {
        if (!sortField) return 0

        const column = columns.find(col => String(col.key) === sortField)
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

                    <thead>
                        <tr className="text-left">
                            {columns.map(col => (
                                <th
                                    key={String(col.key)}
                                    onClick={() => handleSort(String(col.key))}
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

                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedData.map(item => (
                            <tr
                                key={item.id}
                                className="border-t border-zinc-200 hover:bg-zinc-50 transition"
                            >
                                {columns.map(col => (
                                    <td
                                        key={`${item.id}-${String(col.key)}`}
                                        className="px-4 py-4 max-w-xs truncate overflow-hidden whitespace-nowrap"
                                    >
                                        {col.nestedItem ? col.nestedItem(item) : String(item[col.key])}
                                    </td>
                                ))}

                                <td className="px-4 py-4">
                                    <CiMenuKebab />
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
