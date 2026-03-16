"use client";

import { useQuery } from "@apollo/client/react";
import { GET_GLOBAL_CVS_QUERY } from "@/features/cvs/graphql";
import { GetGlobalCVsResponse, GlobalCVs } from "@/features/cvs/types";
import Table from "@/components/table/Table"
import { ColumnType } from "@/components/table/types"
import { useSearchStore } from "@/store/useSearchStore"

import ActionMenu from "@/components/table/ActionMenu";
import Modal from "@/components/ui/Modal";
import { useMemo } from "react";
import useDebounce from "@/components/search/useDebounce";
import UpdateCVModal from "./UpdateCVModal";

const GLOBAL_CVS: GlobalCVs[] = []


export default function CvsPage() {
  const search = useSearchStore((state) => state.search)
  const debouncedSearch  = useDebounce(search, 400)

    const { data: globalCVsData, loading } = useQuery<GetGlobalCVsResponse>(
        GET_GLOBAL_CVS_QUERY
    )

    const cvs = globalCVsData?.cvs || GLOBAL_CVS

    const displayedCVs = useMemo (() => {
      const searchValue = debouncedSearch.toLowerCase()
      
      return cvs.filter(cv => {
        const name = cv?.name.toLowerCase() || ''
        const description = cv?.description.toLowerCase() || ''
        return name.includes(searchValue) || description.includes(searchValue)
    })
    }, [cvs, debouncedSearch])

    if (loading) return <div className="px-6">Loading CVs...</div>

    const columns: ColumnType<GlobalCVs>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description" },
    { key: "user", label: "Employee", sortable: true, nestedItem: (cv) => cv.user?.email || "" },
    {
      key: "actions",
      label: "",
      nestedItem: (cv: GlobalCVs) => (
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
      )
    }
    ] as const;

    return (
        displayedCVs.length === 0 ? 
        <div className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto mt-10 text-center py-8 px-6 text-gray-500 border border-dashed border-zinc-700 rounded-lg">
          Mapping all CVs to employee roles is under development
        </div>
        :
        <Table<GlobalCVs> data={displayedCVs} columns={columns}/>
    )
}