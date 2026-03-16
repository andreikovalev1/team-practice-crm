"use client"

import { GET_GLOBAL_LANGUAGES_QUERY } from "@/features/languages/graphql";
import { GetGlobalLanguagesResponse, GlobalLanguage } from "@/features/languages/types";
import { useQuery } from "@apollo/client/react";
import Table from "@/components/table/Table"
import { ColumnType } from "@/components/table/types"
import { useSearchStore } from "@/store/useSearchStore"
import ActionMenu from "@/components/table/ActionMenu";
import { useMemo } from "react";
import useDebounce from "@/components/search/useDebounce";
import DeleteLanguageModal from "./DeleteLanguageModal"
import UpdateLanguageModal from "./UpdateLanguageModal";

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

    const columns = useMemo<ColumnType<GlobalLanguage>[]>(() => [
      { key: "name", label: "Name", sortable: true },
      { key: "native_name", label: "Native Name" },
      { key: "iso2", label: "Iso2" },
      {
        key: "actions",
        label: "",
        nestedItem: (language: GlobalLanguage) => (
          <ActionMenu
            row={language}
            entityName="Language"
            renderModal={(row, close, action) => {
              if (action === "update") {
                return (
                  <UpdateLanguageModal
                    isOpen={true}
                    onClose={close}
                    language={row}
                  />
                );
              }

              if (action === "delete") {
                return (
                  <DeleteLanguageModal
                    isOpen={true}
                    onClose={close}
                    language={row}
                  />
                );
              }
            }}
          />
        )
      }
    ], [])

    if (loading) return <div className="px-6">Loading languages...</div>

    return(
        loading ? <div className="px-6">Loading skills</div> :
                 <Table<GlobalLanguage> data={displayedLanguages} columns={columns} />
    )
}