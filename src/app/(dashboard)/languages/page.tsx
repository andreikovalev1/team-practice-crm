"use client"

import { GET_GLOBAL_LANGUAGES_QUERY } from "@/features/languages/graphql";
import { GetGlobalLanguagesResponse, GlobalLanguage } from "@/features/languages/types";
import { useQuery } from "@apollo/client/react";
import Table from "@/components/table/Table"
import { ColumnType } from "@/components/table/types"
import { useSearchStore } from "@/store/useSearchStore"

import ActionMenu from "@/components/table/ActionMenu";
import Modal from "@/components/ui/Modal";
import { useMemo } from "react";
import useDebounce from "@/components/search/useDebounce";

const GLOBAL_LANGUAGES: GlobalLanguage[] = [];

export default function LanguagesPage() {
    const search = useSearchStore((state) => state.search)
    const debouncedSearch  = useDebounce(search, 400)

    const { data: globalLanguagesData, loading } = useQuery<GetGlobalLanguagesResponse>(
        GET_GLOBAL_LANGUAGES_QUERY
    );

    const languages = globalLanguagesData?.languages || GLOBAL_LANGUAGES

    const displayedLanguages = useMemo (() => {
      const searchValue = debouncedSearch.toLowerCase()

      return languages.filter(language => {
        const name = language?.name.toLowerCase() || ''
        return name.includes(searchValue)
    })

    }, [languages, debouncedSearch])

    if (loading) return <div className="px-6">Loading languages...</div>

    const columns: ColumnType<GlobalLanguage>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "native_name", label: "Native Name" },
    { key: "iso2", label: "Iso2" },
    {
      key: "actions",
      label: "",
      nestedItem: (language: GlobalLanguage) => (
        <ActionMenu
          row={language}
          renderModal={(row, close, action) => {
            if (action === "update") {
              return (
                <Modal isOpen={true} onClose={close} title={`Update language: ${row.name}`}>
                  <div className="p-4">
                    {/* Тут форма обновления навыка */}
                    Обновить язык: {row.name}
                  </div>
                </Modal>
              );
            }
            if (action === "delete") {
              return (
                <Modal isOpen={true} onClose={close} title={`Delete language: ${row.name}`}>
                  <div className="p-4 text-red-600">
                    Подтвердите удаление языка: {row.name}
                  </div>
                </Modal>
              );
            }
          }}
        />
      )
    }
    ] as const

    return(
        <Table<GlobalLanguage> data={displayedLanguages} columns={columns}></Table>
    )
}