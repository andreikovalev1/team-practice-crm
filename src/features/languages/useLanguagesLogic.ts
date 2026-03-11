import { useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import {
  GET_PROFILE_LANGUAGES_QUERY,
  GET_GLOBAL_LANGUAGES_QUERY,
  ADD_PROFILE_LANGUAGE_MUTATION,
  UPDATE_PROFILE_LANGUAGE_MUTATION,
  DELETE_PROFILE_LANGUAGE_MUTATION,
} from "./graphql";
import {
  GetProfileLanguagesResponse,
  GetGlobalLanguagesResponse,
  ProfileLanguage,
  GlobalLanguage,
  AddLanguageResponse,
  AddProfileLanguageInput,
  UpdateLanguageResponse,
  UpdateProfileLanguageInput,
  DeleteLanguageResponse,
  DeleteProfileLanguageInput,
} from "./types";

const EMPTY_LANGUAGES: ProfileLanguage[] = [];
const GLOBAL_LANGUAGES: GlobalLanguage[] = [];

export function useLanguagesLogic(userId: string | undefined) {
  // ЗАПРОСЫ
  const { data: profileData, loading: profileLoading } = useQuery<GetProfileLanguagesResponse>(
    GET_PROFILE_LANGUAGES_QUERY,
    { variables: { userId }, skip: !userId }
  );

  const { data: globalLanguagesData, loading: globalLoading } = useQuery<GetGlobalLanguagesResponse>(
    GET_GLOBAL_LANGUAGES_QUERY
  );

  const userLanguages = profileData?.profile.languages || EMPTY_LANGUAGES;
  const allGlobalLanguages = globalLanguagesData?.languages || GLOBAL_LANGUAGES;

  // МУТАЦИИ
  const [addLanguageMutation, { loading: isAdding }] = useMutation<
    AddLanguageResponse,
    { language: AddProfileLanguageInput }
  >(ADD_PROFILE_LANGUAGE_MUTATION);

  const [deleteLanguageMutation, { loading: isDeleting }] = useMutation<
    DeleteLanguageResponse,
    { language: DeleteProfileLanguageInput }
  >(DELETE_PROFILE_LANGUAGE_MUTATION);

  const [updateLanguageMutation] = useMutation<
    UpdateLanguageResponse,
    { language: UpdateProfileLanguageInput }
  >(UPDATE_PROFILE_LANGUAGE_MUTATION);

  // ФУНКЦИИ ДЛЯ UI
  const handleAddLanguage = async (name: string, proficiency: string) => {
    if (!userId) return;
    const loadingToast = toast.loading("Adding language...");
    try {
      await addLanguageMutation({
        variables: { language: { userId, name, proficiency } },
      });
      toast.success("Language added successfully!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to add language", { id: loadingToast });
      throw error;
    }
  };

  const handleUpdateLanguage = async (name: string, proficiency: string) => {
    if (!userId) return;
    const loadingToast = toast.loading("Updating language...");
    try {
      await updateLanguageMutation({
        variables: { language: { userId, name, proficiency } },
      });
      toast.success("Language updated!", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to update language", { id: loadingToast });
      throw error;
    }
  };

  const handleRemoveLanguages = async (languageNames: string[]) => {
    if (!userId || languageNames.length === 0) return;
    const loadingToast = toast.loading("Removing language...");
    try {
      await deleteLanguageMutation({
        variables: { language: { userId, name: languageNames } },
      });
      toast.success("Language removed!", { id: loadingToast });
    } catch {
      toast.error("Failed to remove language", { id: loadingToast });
    }
  };

  const availableLanguages = useMemo(() => {
    const userLanguageNames = new Set(userLanguages.map((l) => l.name));
    return allGlobalLanguages.filter((lang) => !userLanguageNames.has(lang.name));
  }, [allGlobalLanguages, userLanguages]);

  return {
    loading: profileLoading || globalLoading,
    isAdding,
    isDeleting,
    userLanguagesCount: userLanguages.length,
    userLanguages,
    availableLanguages,
    addLanguage: handleAddLanguage,
    updateLanguage: handleUpdateLanguage,
    removeLanguages: handleRemoveLanguages,
  };
}