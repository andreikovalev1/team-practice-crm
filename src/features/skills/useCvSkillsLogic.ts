import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { 
  GET_CV_SKILLS_QUERY, 
  ADD_CV_SKILL_MUTATION, 
  DELETE_CV_SKILL_MUTATION, 
  UPDATE_CV_SKILL_MUTATION,
  GET_GLOBAL_SKILLS_QUERY,
  GET_SKILL_CATEGORIES_QUERY 
} from "./graphql";
import { 
  ProfileSkillMastery, 
  GetGlobalSkillsResponse,
  GetSkillCategoriesResponse 
} from "../skills/types";

const EMPTY_SKILLS: ProfileSkillMastery[] = [];

interface GetCvSkillsResponse {
  cv: {
    id: string;
    skills: ProfileSkillMastery[];
  };
}

export function useCvSkillsLogic(cvId: string | undefined) {
  const { data: cvData, loading: cvLoading } = useQuery<GetCvSkillsResponse>(
    GET_CV_SKILLS_QUERY, 
    { variables: { cvId }, skip: !cvId }
  );
  
  const { data: globalSkillsData, loading: globalLoading } = useQuery<GetGlobalSkillsResponse>(
    GET_GLOBAL_SKILLS_QUERY
  );
  const { data: categoriesData, loading: categoriesLoading } = useQuery<GetSkillCategoriesResponse>(
    GET_SKILL_CATEGORIES_QUERY
  );

  // Оборачиваем в useMemo, чтобы стабилизировать ссылки на массивы
  const cvSkills = useMemo(() => cvData?.cv?.skills || EMPTY_SKILLS, [cvData]);
  const categoriesList = useMemo(() => categoriesData?.skillCategories || [], [categoriesData]);
  const allGlobalSkills = useMemo(() => globalSkillsData?.skills || [], [globalSkillsData]);

  const [addMutation, { loading: isAdding }] = useMutation(ADD_CV_SKILL_MUTATION, {
    refetchQueries: [{ query: GET_CV_SKILLS_QUERY, variables: { cvId } }],
  });

  const [deleteMutation, { loading: isDeleting }] = useMutation(DELETE_CV_SKILL_MUTATION, {
    refetchQueries: [{ query: GET_CV_SKILLS_QUERY, variables: { cvId } }],
  });

  const [updateMutation] = useMutation(UPDATE_CV_SKILL_MUTATION, {
    refetchQueries: [{ query: GET_CV_SKILLS_QUERY, variables: { cvId } }],
  });

  const handleAddSkill = async (name: string, categoryName: string, mastery: string) => {
    if (!cvId) return;
    const categoryObj = categoriesList.find(c => c.name === categoryName);
    const loadingToast = toast.loading("Adding skill to CV...");
    try {
      await addMutation({
        variables: { skill: { cvId, name, categoryId: categoryObj?.id || "", mastery } }
      });
      toast.success("Added to CV!", { id: loadingToast });
    } catch { toast.error("Failed to add skill", { id: loadingToast }); }
  };

  const handleRemoveSkill = async (skillNames: string[]) => {
    if (!cvId || skillNames.length === 0) return;
    const loadingToast = toast.loading("Removing...");
    try {
      await deleteMutation({ variables: { skill: { cvId, name: skillNames } } });
      toast.success("Removed from CV!", { id: loadingToast });
    } catch { toast.error("Failed to remove", { id: loadingToast }); }
  };

  const handleUpdateMastery = async (name: string, categoryId: string, mastery: string) => {
    if (!cvId) return;
    const loadingToast = toast.loading("Updating...");
    try {
      await updateMutation({ variables: { skill: { cvId, name, categoryId, mastery } } });
      toast.success("Updated!", { id: loadingToast });
    } catch { toast.error("Failed to update", { id: loadingToast }); }
  };

  const groupedSkills = useMemo(() => {
    return cvSkills.reduce((acc, skill) => {
      const globalMatch = allGlobalSkills.find(g => g.name === skill.name);
      const categoryLabel = globalMatch?.category_name || "Other";
      
      if (!acc[categoryLabel]) acc[categoryLabel] = [];
      
      const categoryObj = categoriesList.find(c => c.name === categoryLabel);
      acc[categoryLabel].push({
        ...skill,
        categoryId: skill.categoryId || categoryObj?.id || ""
      });
      return acc;
    }, {} as Record<string, ProfileSkillMastery[]>);
  }, [cvSkills, allGlobalSkills, categoriesList]);

  const availableSkills = useMemo(() => {
    const ownedNames = new Set(cvSkills.map(s => s.name));
    return allGlobalSkills.filter(s => !ownedNames.has(s.name));
  }, [allGlobalSkills, cvSkills]);

  return {
    loading: cvLoading || globalLoading || categoriesLoading,
    isAdding,
    isDeleting,
    userSkillsCount: cvSkills.length,
    groupedSkills,
    availableSkills,
    addSkill: handleAddSkill,
    removeSkills: handleRemoveSkill,
    updateMastery: handleUpdateMastery,
  };
}