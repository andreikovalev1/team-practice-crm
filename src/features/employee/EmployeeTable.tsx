"use client"

import { MdArrowForwardIos } from "react-icons/md"
import { GoArrowUp } from "react-icons/go"
import { useState } from "react";
import { User } from "@/types/user.types";
import Link from "next/link";
import { ROUTES } from "@/app/configs/routesConfig";
import Image from "next/image";
import { useSearchStore } from "@/store/useSearchStore"

interface EmployeeTableProps {
  employees: User[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const [isSorted, setIsSorted] = useState(false)
  const search = useSearchStore((state) => state.search)


  const displayedEmployees = employees.
  filter(employee => {
    const firstName = employee.profile?.first_name?.toLowerCase() || ''
    const lastName = employee.profile?.last_name?.toLowerCase() || ''
    const fullName = `${firstName} ${lastName}`.trim()
    const searchValue = String(search ?? "").toLowerCase().trim()

    return fullName?.includes(searchValue)
  }).sort((a, b) => {
      if (!isSorted) return 0

      const deptA = a.department_name
      const deptB = b.department_name

      if (!deptA) return 1
      if (!deptB) return -1

      return deptA.localeCompare(deptB)
  })

  return (
    <div className="px-6">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left">
              <th></th>
              <th className="px-4 py-3 font-medium">First Name</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Last Name</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Email</th>
              <th onClick={() => {setIsSorted(prev => !prev)}} className="px-4 py-3 font-medium flex items-center cursor-pointer">
                Department
                <GoArrowUp
                  className={`
                    transition-all duration-200
                    ${isSorted ? "text-black" : "text-gray-400"}
                  `}
                />
              </th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {displayedEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="border-t border-zinc-200 hover:bg-zinc-50 transition"
              >
                <td className="px-4 py-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                    {employee.profile?.avatar ? (
                      <Image
                        src={employee.profile.avatar}
                        alt={`${employee.profile?.first_name || 'User'} avatar`}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm font-medium text-white uppercase select-none">
                        {employee.profile?.first_name
                          ? employee.profile.first_name.charAt(0)
                          : employee.email.charAt(0)}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4">{employee.profile?.first_name}</td>
                <td className="px-4 py-4 hidden md:table-cell">{employee.profile?.last_name}</td>
                <td className="px-4 py-4 hidden md:table-cell">{employee.email}</td>
                <td className="px-4 py-4">{employee.department_name}</td>
                <td className="px-4 py-4">{employee.position_name}</td>
                <td className="px-4 py-4"><Link href={ROUTES.PROFILE(employee.id)}> <MdArrowForwardIos size={14} /> </Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}