export interface ProfileSkillMastery {
  name: string;
  categoryId: string;
  mastery: string;
}

export interface ProfileWithSkills {
  id: string;
  skills: ProfileSkillMastery[];
}

export interface GlobalSkill {
  id: string;
  name: string;
  category_name: string;
}

export interface GetProfileSkillsResponse {
  profile: ProfileWithSkills;
}

export interface GetGlobalSkillsResponse {
  skills: GlobalSkill[];
}

export interface SkillCategory {
  id: string;
  name: string;
}

export interface GetSkillCategoriesResponse {
  skillCategories: SkillCategory[];
}

// --- ТИПЫ ДЛЯ МУТАЦИЙ (INPUTS) ---

export interface AddProfileSkillInput {
  userId: string;
  name: string;
  categoryId?: string;
  mastery: string;
}

export interface UpdateProfileSkillInput {
  userId: string;
  name: string;
  categoryId?: string;
  mastery: string;
}

export interface DeleteProfileSkillInput {
  userId: string;
  name: string[];
}

export interface MutationProfileResponse {
  addProfileSkill?: ProfileWithSkills;
  updateProfileSkill?: ProfileWithSkills;
  deleteProfileSkill?: ProfileWithSkills;
}