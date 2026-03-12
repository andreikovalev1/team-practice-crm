"use client"

import { GET_GLOBAL_SKILLS_QUERY } from "@/features/skills/graphql"
import { GetGlobalSkillsResponse, GlobalSkill } from "@/features/skills/types"
import { useQuery } from "@apollo/client/react"
import Table from "@/components/table/Table"
import { ColumnType } from "@/components/table/types"
import { useSearchStore } from "@/store/useSearchStore"

const GLOBAL_SKILL: GlobalSkill[] = []

const columns: ColumnType<GlobalSkill>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "category_name", label: "Category", sortable: true },
] as const

export default function SkillsPage() {
    const search = useSearchStore((state) => state.search)

    const { data: globalSkillsData, loading } = useQuery<GetGlobalSkillsResponse>(
        GET_GLOBAL_SKILLS_QUERY
    )

    const skills = globalSkillsData?.skills || GLOBAL_SKILL

    const displayedSkills = skills
    .filter(skill => {
        const name = skill?.name.toLowerCase() || ''
        const category = skill?.category_name.toLowerCase() || ''
        const searchValue = search.toLowerCase()
        return name.includes(searchValue) || category.includes(searchValue)
    })

    if (loading) return <div className="px-6">Loading skills...</div>

    return (
        <Table<GlobalSkill> data={displayedSkills} columns={columns}/>
    )
}