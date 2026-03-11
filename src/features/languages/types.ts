export interface ProfileLanguage {
  name: string;
  proficiency: string;
}

export interface GlobalLanguage {
  id: string;
  name: string;
  native_name?: string;
  iso2: string;
}

export interface GetProfileLanguagesResponse {
  profile: {
    id: string;
    languages: ProfileLanguage[];
  };
}

export interface GetGlobalLanguagesResponse {
  languages: GlobalLanguage[];
}

export interface AddProfileLanguageInput {
  userId: string;
  name: string;
  proficiency: string;
}

export interface AddLanguageResponse {
  addProfileLanguage: {
    id: string;
    languages: ProfileLanguage[];
  };
}

export interface UpdateProfileLanguageInput {
  userId: string;
  name: string;
  proficiency: string;
}

export interface UpdateLanguageResponse {
  updateProfileLanguage: {
    id: string;
    languages: ProfileLanguage[];
  };
}

export interface DeleteProfileLanguageInput {
  userId: string;
  name: string[];
}

export interface DeleteLanguageResponse {
  deleteProfileLanguage: {
    id: string;
    languages: ProfileLanguage[];
  };
}