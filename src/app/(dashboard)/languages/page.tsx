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
import DeleteLanguageModal from "@/features/languages/globalPageModals/DeleteLanguageModal"
import UpdateLanguageModal from "@/features/languages/globalPageModals/UpdateLanguageModal";

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
          <div className="flex justify-end">
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
          </div>
        )
      }
    ], [])

    return(
        loading ? 
          <div className="text-center py-26 text-gray-500 font-medium">
            Loading Languages...
          </div> :
          <Table<GlobalLanguage> data={displayedLanguages} columns={columns} />
    )
}