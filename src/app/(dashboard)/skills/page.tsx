// "use client"

// import { GET_GLOBAL_SKILLS_QUERY } from "@/features/skills/graphql"
// import { GetGlobalSkillsResponse, GlobalSkill } from "@/features/skills/types"
// import { useQuery } from "@apollo/client/react"
// import Table from "@/components/table/Table"
// import { ColumnType } from "@/components/table/types"
// import { useSearchStore } from "@/store/useSearchStore"

// import ActionMenu from "@/components/table/ActionMenu";
// import Modal from "@/components/ui/Modal";


// const GLOBAL_SKILL: GlobalSkill[] = []

// const columns: ColumnType<GlobalSkill>[] = [
//     { key: "name", label: "Name", sortable: true },
//     { key: "category_name", label: "Category", sortable: true },
//     {
//       key: "actions", 
//       label: "", 
//       nestedItem: (skill: GlobalSkill) => (
//         <ActionMenu
//           row={skill}
//           renderModal={(row, close) => (
//             <Modal isOpen={true} onClose={close} title={`Skill: ${row.name}`}>
//               <div className="p-4">Create/Delete skill - placeholder</div>
//             </Modal>
//           )}
//         />
//       )
//     }
// ] as const

// export default function SkillsPage() {
//     const search = useSearchStore((state) => state.search)

//     const { data: globalSkillsData, loading } = useQuery<GetGlobalSkillsResponse>(
//         GET_GLOBAL_SKILLS_QUERY
//     )

//     const skills = globalSkillsData?.skills || GLOBAL_SKILL

//     const displayedSkills = skills
//     .filter(skill => {
//         const name = skill?.name.toLowerCase() || ''
//         const category = skill?.category_name.toLowerCase() || ''
//         const searchValue = search.toLowerCase()
//         return name.includes(searchValue) || category.includes(searchValue)
//     })

//     if (loading) return <div className="px-6">Loading skills...</div>

//     return (
//         <Table<GlobalSkill> data={displayedSkills} columns={columns}/>
//     )
// }

"use client";

import { GET_GLOBAL_SKILLS_QUERY } from "@/features/skills/graphql";
import { GetGlobalSkillsResponse, GlobalSkill } from "@/features/skills/types";
import { useQuery } from "@apollo/client/react";
import Table from "@/components/table/Table";
import { ColumnType } from "@/components/table/types";
import { useSearchStore } from "@/store/useSearchStore";

import ActionMenu from "@/components/table/ActionMenu";
import Modal from "@/components/ui/Modal";

const GLOBAL_SKILL: GlobalSkill[] = [];

export default function SkillsPage() {
  const search = useSearchStore((state) => state.search);
  const { data: globalSkillsData, loading } = useQuery<GetGlobalSkillsResponse>(GET_GLOBAL_SKILLS_QUERY);
  const skills = globalSkillsData?.skills || GLOBAL_SKILL;

  const displayedSkills = skills.filter(skill => {
    const name = skill?.name.toLowerCase() || '';
    const category = skill?.category_name.toLowerCase() || '';
    const searchValue = search.toLowerCase();
    return name.includes(searchValue) || category.includes(searchValue);
  });

  if (loading) return <div className="px-6">Loading skills...</div>;

  const columns: ColumnType<GlobalSkill>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "category_name", label: "Category", sortable: true },
    {
      key: "actions",
      label: "",
      nestedItem: (skill: GlobalSkill) => (
        <ActionMenu
          row={skill}
          renderModal={(row, close, action) => {
            if (action === "update") {
              return (
                <Modal isOpen={true} onClose={close} title={`Update Skill: ${row.name}`}>
                  <div className="p-4">
                    {/* Тут форма обновления навыка */}
                    Обновить навык: {row.name}
                  </div>
                </Modal>
              );
            }
            if (action === "delete") {
              return (
                <Modal isOpen={true} onClose={close} title={`Delete Skill: ${row.name}`}>
                  <div className="p-4 text-red-600">
                    Подтвердите удаление навыка: {row.name}
                  </div>
                </Modal>
              );
            }
          }}
        />
      )
    }
  ] as const;

  return <Table<GlobalSkill> data={displayedSkills} columns={columns} />;
}