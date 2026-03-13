"use client";

import { useQuery } from "@apollo/client/react";
import { GET_GLOBAL_CVS_QUERY } from "@/features/cvs/graphql";
import { GetGlobalCVsResponse, GlobalCVs } from "@/features/cvs/types";
import Table from "@/components/table/Table"
import { ColumnType } from "@/components/table/types"
import { useSearchStore } from "@/store/useSearchStore"

import ActionMenu from "@/components/table/ActionMenu";
import Modal from "@/components/ui/Modal";

const GLOBAL_CVS: GlobalCVs[] = []

const columns: ColumnType<GlobalCVs>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "user", label: "Employee", sortable: true, nestedItem: (cv) => cv.user?.email || "" },
    {
      key: "actions",
      label: "",
      nestedItem: (cv: GlobalCVs) => (
        <ActionMenu
          row={cv}
          renderModal={(row, close, action) => {
            if (action === "update") {
              return (
                <Modal isOpen={true} onClose={close} title={`Update cv: ${row.name}`}>
                  <div className="p-4">
                    {/* Тут форма обновления навыка */}
                    Обновить cv: {row.name}
                  </div>
                </Modal>
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

export default function CvsPage() {
const search = useSearchStore((state) => state.search)

    const { data: globalCVsData, loading } = useQuery<GetGlobalCVsResponse>(
        GET_GLOBAL_CVS_QUERY
    )

    const cvs = globalCVsData?.cvs || GLOBAL_CVS

    const displayedCVs = cvs
    .filter(cv => {
        const name = cv?.name.toLowerCase() || ''
        const description = cv?.description.toLowerCase() || ''
        const searchValue = search.toLowerCase()
        return name.includes(searchValue) || description.includes(searchValue)
    })

    if (loading) return <div className="px-6">Loading CVs...</div>
    console.log("CVs data:", globalCVsData);

    return (
        <Table<GlobalCVs> data={displayedCVs} columns={columns}/>
    )
}