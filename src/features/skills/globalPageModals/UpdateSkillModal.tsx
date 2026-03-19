"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton";

import { UPDATE_SKILL_MUTATION, GET_SKILL_CATEGORIES_QUERY } from "@/features/skills/graphql";
import { GlobalSkill } from "@/features/skills/types";

interface UpdateGlobalSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: GlobalSkill | null;
}

interface SkillCategory {
  id: string;
  name: string;
}

interface GetSkillCategoriesResponse {
  skillCategories: SkillCategory[];
}

export default function UpdateGlobalSkillModal({ isOpen, onClose, skill }: UpdateGlobalSkillModalProps) {
  const router = useRouter();

  const [prevSkillId, setPrevSkillId] = useState<string | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  if (skill?.id !== prevSkillId || isOpen !== prevIsOpen) {
    setPrevSkillId(skill?.id);
    setPrevIsOpen(isOpen);

    if (isOpen && skill) {
      setName(skill.name);
      setCategoryName(skill.category_name || "");
      setCategoryId("");
    }
  }

  const { data: categoriesData, loading: loadingCategories } = useQuery<GetSkillCategoriesResponse>(GET_SKILL_CATEGORIES_QUERY, {
    skip: !isOpen,
  });

  const [updateSkill, { loading: isUpdating }] = useMutation(UPDATE_SKILL_MUTATION, {
    refetchQueries: ["GetGlobalSkills"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategoryId = categoryId;
    if (!finalCategoryId && categoryName && categoriesData) {
      const foundCat = categoriesData.skillCategories.find((c) => c.name === categoryName);
      if (foundCat) finalCategoryId = foundCat.id;
    }

    if (!skill || !name || !finalCategoryId) {
      toast.error("Please fill all fields");
      return;
    }

    const loadingToast = toast.loading("Updating skill...");
    try {
      await updateSkill({
        variables: {
          skill: {
            skillId: skill.id,
            name,
            categoryId: finalCategoryId,
          },
        },
      });
      toast.success("Skill updated successfully!", { id: loadingToast });
      onClose();
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update skill";
      toast.error(msg, { id: loadingToast });
    }
  };

  const isLoading = isUpdating || loadingCategories;

  const isChanged = skill && (name !== skill.name || categoryName !== (skill.category_name || ""));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Skill">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        <FloatingInput
          label="Skill Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />

        <FloatingSelect
          label={loadingCategories ? "Loading categories..." : "Category"}
          options={categoriesData?.skillCategories || []}
          value={categoryName}
          onChange={(selectedName) => {
            setCategoryName(selectedName);
            const selectedCat = categoriesData?.skillCategories.find((c) => c.name === selectedName);
            if (selectedCat) setCategoryId(selectedCat.id);
          }}
          disabled={isLoading}
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          />
          <OvalButton
            text={isUpdating ? "Updating..." : "Update"}
            type="submit"
            disabled={isLoading || !isChanged}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}