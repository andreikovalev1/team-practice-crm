"use client";

import { useQuery } from "@apollo/client/react";
import { GET_GLOBAL_CVS_QUERY } from "@/features/cvs/graphql";
import { GetGlobalCVsResponse, GlobalCVs } from "@/features/cvs/types";
import Table from "@/components/table/Table"
import { ColumnType } from "@/components/table/types"
import { useSearchStore } from "@/store/useSearchStore"
import ActionMenu from "@/components/table/ActionMenu";
import Modal from "@/components/ui/Modal";
import { useMemo, useState } from "react";
import useDebounce from "@/components/search/useDebounce";
import UpdateCVModal from "@/features/cvs/UpdateCvModal";
import { GoArrowUp } from "react-icons/go"
import { useAdmin } from "@/lib/useAdmin";
import Link from "next/link";
import { ROUTES } from "@/app/configs/routesConfig";
import { MdArrowForwardIos } from "react-icons/md"

const GLOBAL_CVS: GlobalCVs[] = []


export default function CvsPage() {
    const search = useSearchStore((state) => state.search)
    const debouncedSearch  = useDebounce(search, 400)
    const [sortField, setSortField] = useState<string | null>(null)
    const isAdmin = useAdmin();

    const { data: globalCVsData, loading, error } = useQuery<GetGlobalCVsResponse>(
        GET_GLOBAL_CVS_QUERY
    )

    const cvs = globalCVsData?.cvs || GLOBAL_CVS

    console.log("Loading:", loading)
    console.log("Data:", globalCVsData)
    console.log("GraphQL error:", error)
    

    const handleSort = (field: string) => {
      setSortField(prev => (prev === field ? null : field));
    };

    const displayedCVs = useMemo (() => {
      const searchValue = debouncedSearch.toLowerCase()
      
      return cvs.filter(cv => {
        const name = cv?.name.toLowerCase() || ''
        const description = cv?.description.toLowerCase() || ''
        return name.includes(searchValue) || description.includes(searchValue)
    })
    // .sort((a, b) => {
    //   if (!sortField) return 0

    //   let valueA = ''
    //   let valueB = ''

    //   switch (sortField) {
    //     // case "name":
    //     //   valueA = a.?.first_name || ''
    //     //   valueB = b.profile?.first_name || ''
    //     //   break
    //     // case "description":
    //     //   valueA = a.profile?.last_name || ''
    //     //   valueB = b.profile?.last_name || ''
    //     //   break
    //     // case "employee":
    //     //   valueA = a.email || ''
    //     //   valueB = b.email || ''
    //     //   break
    //   }

    //   if (valueA && !valueB) return -1
    //   if (!valueA && valueB) return 1

    //   return valueA.localeCompare(valueB)
    // })
    }, [cvs, debouncedSearch, sortField])

    if (loading) return <div className="px-6">Loading CVs...</div>

    if (!isAdmin) {
      return (
        <div className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto mt-10 text-center py-8 px-6 text-gray-500 border border-dashed border-zinc-700 rounded-lg">
          Mapping all CVs to employee roles is under development
        </div>
      );
    }
    // const columns: ColumnType<GlobalCVs>[] = [
    // { key: "name", label: "Name", sortable: true },
    // { key: "description", label: "Description" },
    // { key: "user", label: "Employee", sortable: true, nestedItem: (cv) => cv.user?.email || "" },
    // {
    //   key: "actions",
    //   label: "",
    //   nestedItem: (cv: GlobalCVs) => (
    //     <ActionMenu
    //       row={cv}
    //       entityName="Cv"
    //       renderModal={(row, close, action) => {
    //         if (action === "update") {
    //           return (
    //             <UpdateCVModal
    //               isOpen={true}
    //               onClose={close}
    //               cv={row}
    //             />
    //           );
    //         }
    //         if (action === "delete") {
    //           return (
    //             <Modal isOpen={true} onClose={close} title={`Delete cv: ${row.name}`}>
    //               <div className="p-4 text-red-600">
    //                 Подтвердите удаление cv: {row.name}
    //               </div>
    //             </Modal>
    //           );
    //         }
    //       }}
    //     />
    //   )
    // }
    // ] as const;

    return (
        displayedCVs.length === 0 ? 
        <div className="px-6 py-8 text-center text-gray-400">
          No CVs found in the system.
        </div>
        :
        <div className="px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left">
                  <th onClick={() => handleSort("first_name")} className="px-4 py-3 font-medium cursor-pointer">
                    <div className="flex items-center">
                      Name
                      <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "first_name" ? "text-black" : "text-gray-400"}`} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("last_name")} className="px-4 py-3 font-medium hidden md:table-cell cursor-pointer">
                    <div className="flex items-center">
                      Education
                      <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "last_name" ? "text-black" : "text-gray-400"}`} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("email")} className="px-4 py-3 font-medium hidden md:table-cell cursor-pointer">
                    <div className="flex items-center">
                      Employee
                      <GoArrowUp className={`transition-all duration-200 ml-1 ${sortField === "email" ? "text-black" : "text-gray-400"}`} />
                    </div>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayedCVs.map((cv) => (
                  <tr key={cv.id} className="border-t border-zinc-200 hover:bg-zinc-50 transition">
                    <td className="px-4 py-4">{cv.name}</td>
                    <td className="px-4 py-4 hidden md:table-cell">{cv.education}</td>
                    <td className="px-4 py-4 hidden md:table-cell">{cv.user?.email}</td>
                    <td className="px-4 py-4 text-right">
                      {isAdmin ? (
                                <ActionMenu
                                  row={cv}
                                  entityName="Cv"
                                  renderModal={(row, close, action) => {
                                    if (action === "update") {
                                      return (
                                        <UpdateCVModal
                                          isOpen={true}
                                          onClose={close}
                                          cv={row}
                                        />
                                      );
                                    }
                                    if (action === "delete") {
                                      return (
                                        <Modal isOpen={true} onClose={close} title={`Delete cv: ${row.name}`}>
                                          <div className="p-4 text-red-600">
                                            Подтвердите удаление cv: {row.name}
                                          </div>
                                        </Modal>
                                      );
                                    }
                                  }}
                                />
                      ) : (
                        <Link href={ROUTES.CV_DETAILS(cv.id || '')} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-black transition-colors">
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