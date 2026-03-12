"use client"

import { GET_GLOBAL_LANGUAGES_QUERY } from "@/features/languages/graphql";
import { GetGlobalLanguagesResponse, GlobalLanguage } from "@/features/languages/types";
import { useQuery } from "@apollo/client/react";
import Table from "@/components/table/Table"
import { ColumnType } from "@/components/table/types"
import { useSearchStore } from "@/store/useSearchStore"

const GLOBAL_LANGUAGES: GlobalLanguage[] = [];

const columns: ColumnType<GlobalLanguage>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "native_name", label: "Native Name" },
    { key: "iso2", label: "Iso2" },
] as const

export default function LanguagesPage() {
    const search = useSearchStore((state) => state.search)

    const { data: globalLanguagesData, loading } = useQuery<GetGlobalLanguagesResponse>(
        GET_GLOBAL_LANGUAGES_QUERY
    );

    const languages = globalLanguagesData?.languages || GLOBAL_LANGUAGES

    const displayedLanguages = languages
    .filter(language => {
        const name = language?.name.toLowerCase() || ''
        const searchValue = search.toLowerCase()
        return name.includes(searchValue)
    })

    if (loading) return <div className="px-6">Loading languages...</div>

    return(
        <Table<GlobalLanguage> data={displayedLanguages} columns={columns}></Table>
    )
}