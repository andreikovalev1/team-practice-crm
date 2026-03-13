"use client";

import { GET_GLOBAL_SKILLS_QUERY } from "@/features/skills/graphql";
import { GetGlobalSkillsResponse, GlobalSkill } from "@/features/skills/types";
import { useQuery } from "@apollo/client/react";
import Table from "@/components/table/Table";
import { ColumnType } from "@/components/table/types";
import { useSearchStore } from "@/store/useSearchStore";
import ActionMenu from "@/components/table/ActionMenu";
import { useMemo } from "react";
import useDebounce from "@/components/search/useDebounce";
import UpdateSkillModal from "./UpdateSkillModal";
import DeleteSkillModal from "./DeleteSkillModal";

const GLOBAL_SKILL: GlobalSkill[] = [];

export default function SkillsPage() {
  const search = useSearchStore((state) => state.search);
  const debouncedSearch = useDebounce(search, 400);
  const { data: globalSkillsData, loading } = useQuery<GetGlobalSkillsResponse>(GET_GLOBAL_SKILLS_QUERY);
  const skills = globalSkillsData?.skills || GLOBAL_SKILL;


  const displayedSkills = useMemo(() => {
    const searchValue = debouncedSearch.toLowerCase();
    return skills.filter(skill => {
      const name = skill?.name.toLowerCase() || '';
      const category = skill?.category_name.toLowerCase() || '';
      return name.includes(searchValue) || category.includes(searchValue);
    });
  }, [skills, debouncedSearch]);

  const columns: ColumnType<GlobalSkill>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "category_name", label: "Category", sortable: true },
    {
      key: "actions",
      label: "",
      nestedItem: (skill: GlobalSkill) => (
        <ActionMenu
          row={skill}
          entityName="Skill"
          renderModal={(row, close, action) => {
              if (action === "update") {
                return (
                  <UpdateSkillModal
                    isOpen={true}
                    onClose={close}
                    skill={row}
                  />
                );
              }

              if (action === "delete") {
                return (
                  <DeleteSkillModal
                    isOpen={true}
                    onClose={close}
                    skill={row}
                  />
                );
              }
            }}
        />
      ),
    },
  ] as const;

  return loading ? <div className="px-6">Loading skills</div> :
         <Table<GlobalSkill> data={displayedSkills} columns={columns} />
}