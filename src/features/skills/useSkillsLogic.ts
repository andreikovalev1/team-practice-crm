import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { 
  GET_PROFILE_SKILLS_QUERY, 
  GET_GLOBAL_SKILLS_QUERY,
  GET_SKILL_CATEGORIES_QUERY,
  ADD_PROFILE_SKILL_MUTATION,
  DELETE_PROFILE_SKILL_MUTATION,
  UPDATE_PROFILE_SKILL_MUTATION,
} from "./graphql";
import { 
  GetProfileSkillsResponse, 
  GetGlobalSkillsResponse, 
  GetSkillCategoriesResponse,
  ProfileSkillMastery,
  GlobalSkill,
  SkillCategory,
} from "./types";

const EMPTY_SKILLS: ProfileSkillMastery[] = [];
const GLOBAL_SKILL: GlobalSkill[] = [];
const CATEGORY_SKILLS: SkillCategory[] = [];

export function useSkillsLogic(userId: string | undefined) {
  // --- ЗАПРОСЫ ---
  const { data: profileData, loading: profileLoading } = useQuery<GetProfileSkillsResponse>(
    GET_PROFILE_SKILLS_QUERY,
    { variables: { userId }, skip: !userId }
  );
  const { data: globalSkillsData, loading: globalLoading } = useQuery<GetGlobalSkillsResponse>(
    GET_GLOBAL_SKILLS_QUERY
  );
  const { data: categoriesData, loading: categoriesLoading } = useQuery<GetSkillCategoriesResponse>(
    GET_SKILL_CATEGORIES_QUERY
  );

  const userSkills = profileData?.profile.skills || EMPTY_SKILLS;
  const categoriesList = categoriesData?.skillCategories || CATEGORY_SKILLS;
  const allGlobalSkills = globalSkillsData?.skills || GLOBAL_SKILL;

  // --- МУТАЦИИ ---
  const [addSkillMutation, { loading: isAdding }] = useMutation(ADD_PROFILE_SKILL_MUTATION, {
    refetchQueries: [{ query: GET_PROFILE_SKILLS_QUERY, variables: { userId } }],
  });

  const [deleteSkillMutation, { loading: isDeleting }] = useMutation(DELETE_PROFILE_SKILL_MUTATION, {
    refetchQueries: [{ query: GET_PROFILE_SKILLS_QUERY, variables: { userId } }],
  });

  const [updateSkillMutation] = useMutation(UPDATE_PROFILE_SKILL_MUTATION, {
    refetchQueries: [{ query: GET_PROFILE_SKILLS_QUERY, variables: { userId } }],
  });

  // --- ФУНКЦИИ ДЛЯ UI ---
  const handleAddSkill = async (name: string, categoryName: string, mastery: string) => {
    if (!userId) return;
    
    // ИЩЕМ ID КАТЕГОРИИ ПО ЕЕ ИМЕНИ! (решение проблемы с 'Other')
    const categoryObj = categoriesList.find(c => c.name === categoryName);
    const categoryId = categoryObj ? categoryObj.id : "";

    const loadingToast = toast.loading("Adding skill...");
    try {
      await addSkillMutation({
        variables: { skill: { userId, name, categoryId, mastery } }
      });
      toast.success("Skill added successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to add skill", { id: loadingToast });
      throw error;
    }
  };

  const handleRemoveSkill = async (skillNames: string[]) => {
    if (!userId || skillNames.length === 0) return;
    const loadingToast = toast.loading("Removing skill...");
    try {
      await deleteSkillMutation({
        variables: { skill: { userId, name: skillNames } } 
      });
      toast.success("Skill removed!", { id: loadingToast });
    } catch {
      toast.error("Failed to remove skill", { id: loadingToast });
    }
  };

  const handleUpdateMastery = async (name: string, categoryId: string, mastery: string) => {
    console.log("update mastery:", name, mastery);
    if (!userId) return;
    const loadingToast = toast.loading("Updating mastery...");
    try {
      await updateSkillMutation({
        variables: { skill: { userId, name, categoryId, mastery } }
      });
      toast.success("Mastery updated!", { id: loadingToast });
    } catch {
      toast.error("Failed to update mastery", { id: loadingToast });
    }
  };

  const groupedSkills = useMemo(() => {
    return userSkills.reduce((acc, skill) => {
      const globalSkillMatch = allGlobalSkills.find(g => g.name === skill.name);
      const categoryLabel = globalSkillMatch?.category_name || "Other";
      
      if (!acc[categoryLabel]) acc[categoryLabel] = [];
      const categoryObj = categoriesList.find(c => c.name === categoryLabel);
      const fixedSkill = {
         ...skill,
         categoryId: skill.categoryId || categoryObj?.id || ""
      };

      acc[categoryLabel].push(fixedSkill);
      return acc;
    }, {} as Record<string, ProfileSkillMastery[]>);
  }, [userSkills, allGlobalSkills, categoriesList]);

  const availableSkills = useMemo(() => {
    const userSkillNames = new Set(userSkills.map(s => s.name));
    return allGlobalSkills.filter(skill => !userSkillNames.has(skill.name));
  }, [allGlobalSkills, userSkills]);

  return {
    loading: profileLoading || globalLoading || categoriesLoading,
    isAdding,
    isDeleting,
    userSkillsCount: userSkills.length,
    groupedSkills,
    availableSkills,
    addSkill: handleAddSkill,
    removeSkills: handleRemoveSkill,
    updateMastery: handleUpdateMastery,
  };
}

export type UseSkillsLogicReturn = ReturnType<typeof useSkillsLogic>;