"use client"

import { MdArrowForwardIos } from "react-icons/md"
import { GoArrowUp } from "react-icons/go"
import { useState } from "react";
import { User } from "@/types/user.types";
import Link from "next/link";
import { ROUTES } from "@/app/configs/routesConfig";
import Image from "next/image";
import { useSearchStore } from "@/store/useSearchStore"
import AdminActionMenu from "./AdminActionMenu"
import { useAdmin } from "@/lib/useAdmin";
import { useMemo } from "react";

import useDebounce from "@/components/search/useDebounce";

interface EmployeeTableProps {
  employees: User[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [sortField, setSortField] = useState<string | null>(null)
  const search = useSearchStore((state) => state.search)
  const debouncedSearch  = useDebounce(search, 400)
  const isAdmin = useAdmin();

  const handleSort = (field: string) => {
    setSortField(prev => (prev === field ? null : field));
  };

  const displayedEmployees = useMemo (() => {
    const searchValue = debouncedSearch.toLowerCase().trim()

    return employees
    .filter(employee => {
      const firstName = employee.profile?.first_name?.toLowerCase() || ''
      const lastName = employee.profile?.last_name?.toLowerCase() || ''
      const fullName = `${firstName} ${lastName}`.trim()
      return fullName.includes(searchValue)
    })
    .sort((a, b) => {
      if (!sortField) return 0

      let valueA = ''
      let valueB = ''

      switch (sortField) {
        case "first_name":
          valueA = a.profile?.first_name || ''
          valueB = b.profile?.first_name || ''
          break
        case "last_name":
          valueA = a.profile?.last_name || ''
          valueB = b.profile?.last_name || ''
          break
        case "email":
          valueA = a.email || ''
          valueB = b.email || ''
          break
        case "department":
          valueA = a.department_name || ''
          valueB = b.department_name || ''
          break
        case "position":
          valueA = a.position_name || ''
          valueB = b.position_name || ''
          break
      }

      if (valueA && !valueB) return -1
      if (!valueA && valueB) return 1

      return valueA.localeCompare(valueB)
    })
  }, [employees, debouncedSearch, sortField]);

  return (
    <div className="px-6">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left">
              <th></th>
              <th onClick={() => handleSort("first_name")} className="px-4 py-3 font-medium cursor-pointer">
                <div className="flex items-center">
                  First Name
                  <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "first_name" ? "text-black" : "text-gray-400"}`} />
                </div>
              </th>
              <th onClick={() => handleSort("last_name")} className="px-4 py-3 font-medium hidden md:table-cell cursor-pointer">
                <div className="flex items-center">
                  Last Name
                  <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "last_name" ? "text-black" : "text-gray-400"}`} />
                </div>
              </th>
              <th onClick={() => handleSort("email")} className="px-4 py-3 font-medium hidden md:table-cell cursor-pointer">
                <div className="flex items-center">
                  Email
                  <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "email" ? "text-black" : "text-gray-400"}`} />
                </div>
              </th>
              <th onClick={() => handleSort("department")} className="px-4 py-3 font-medium cursor-pointer">
                <div className="flex items-center">
                  Department
                  <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "department" ? "text-black" : "text-gray-400"}`} />
                </div>
              </th>
              <th onClick={() => handleSort("position")} className="px-4 py-3 font-medium cursor-pointer">
                <div className="flex items-center">
                  Position
                  <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "position" ? "text-black" : "text-gray-400"}`} />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.map((employee) => (
              <tr key={employee.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition">
                <td className="px-4 py-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                    {employee.profile?.avatar ? (
                      <Image src={employee.profile.avatar} alt="Avatar" fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-sm font-medium text-white uppercase">{employee.profile?.first_name?.charAt(0) || employee.email.charAt(0)}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">{employee.profile?.first_name}</td>
                <td className="px-4 py-4 hidden md:table-cell">{employee.profile?.last_name}</td>
                <td className="px-4 py-4 hidden md:table-cell">{employee.email}</td>
                <td className="px-4 py-4">{employee.department_name}</td>
                <td className="px-4 py-4">{employee.position_name}</td>
                <td className="px-4 py-4 text-right">
                  {isAdmin ? (
                    <AdminActionMenu employee={employee} />
                  ) : (
                    <Link href={ROUTES.PROFILE(employee.id)} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black transition-colors">
                      <MdArrowForwardIos size={14} />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}