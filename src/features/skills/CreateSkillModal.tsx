"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton";
import { CREATE_SKILL_MUTATION, GET_SKILL_CATEGORIES_QUERY } from "./graphql";

interface CreateSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SkillCategory {
  id: string;
  name: string;
}

interface GetSkillCategoriesResponse {
  skillCategories: SkillCategory[];
}

export default function CreateSkillModal({ isOpen, onClose }: CreateSkillModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const { data: categoriesData, loading: loadingCategories } = useQuery<GetSkillCategoriesResponse>(GET_SKILL_CATEGORIES_QUERY, {
    skip: !isOpen,
  });

  const [createSkill, { loading: isAdding }] = useMutation(CREATE_SKILL_MUTATION, {
    refetchQueries: ["GetGlobalSkills"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !categoryId) return;
    const loadingToast = toast.loading("Creating skill...");

    try {
      await createSkill({
        variables: {
          skill: {
            name: name,
            categoryId: categoryId, 
          }
        }
      });

      toast.success("Skill created successfully!", { id: loadingToast });
      setName("");
      setCategoryId("");
      setCategoryName("");
      
      onClose();
      router.refresh(); 
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create skill";
      toast.error(msg, { id: loadingToast });
    }
  };

  const isLoading = isAdding || loadingCategories;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Skill">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FloatingInput
          label="Skill Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />

        <FloatingSelect
          label={loadingCategories ? "Loading categories..." : "Category"}
          options={categoriesData?.skillCategories || []}
          value={categoryName}
          onChange={(selectedName) => {
            setCategoryName(selectedName);
            const selectedCat = categoriesData?.skillCategories.find((c: SkillCategory) => c.name === selectedName);
            if (selectedCat) setCategoryId(selectedCat.id);
          }}
          disabled={isLoading}
        />

        <div className="flex items-center gap-3 pt-4">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          />
          <OvalButton
            text={isAdding ? "Creating..." : "Create"}
            type="submit"
            disabled={isLoading || !name || !categoryId}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}