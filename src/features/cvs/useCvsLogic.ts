import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import {
  GET_USER_CVS_QUERY,
  CREATE_CV_MUTATION,
  DELETE_CV_MUTATION,
} from "./graphql";
import {
  GetUserCvsResponse,
  CreateCvResponse,
  CreateCvInput,
  DeleteCvResponse,
  DeleteCvInput,
  Cv,
} from "./types";

const EMPTY_CVS: Cv[] = [];

export function useCvsLogic(userId: string | undefined) {
  // --- ЛОКАЛЬНЫЕ СОСТОЯНИЯ (Для поиска и сортировки) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { data, loading: isLoadingCvs } = useQuery<GetUserCvsResponse>(
    GET_USER_CVS_QUERY,
    {
      variables: { userId },
      skip: !userId,
    }
  );

  const [createCvMutation, { loading: isCreating }] = useMutation<CreateCvResponse,{ cv: CreateCvInput }> (
    CREATE_CV_MUTATION, {
    refetchQueries: [{ query: GET_USER_CVS_QUERY, variables: { userId } }],
  });

  const [deleteCvMutation, { loading: isDeleting }] = useMutation<DeleteCvResponse,{ cv: DeleteCvInput }>(DELETE_CV_MUTATION);
  const rawCvs = data?.user?.cvs || EMPTY_CVS;
  const filteredAndSortedCvs = useMemo(() => {
    // 1. Сначала фильтруем (Поиск по имени или описанию)
    const filtered = rawCvs.filter((cv) => {
      const lowerTerm = searchTerm.toLowerCase();
      const matchName = cv.name.toLowerCase().includes(lowerTerm);
      const matchDesc = cv.description.toLowerCase().includes(lowerTerm);
      return matchName || matchDesc;
    });

    return filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [rawCvs, searchTerm, sortDirection]);

  // --- ОБРАБОТЧИКИ ДЕЙСТВИЙ (ХЭНДЛЕРЫ) ---
  const handleToggleSort = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleDeleteCv = async (cvId: string) => {
    const loadingToast = toast.loading("Deleting CV...");
    try {
      await deleteCvMutation({
        variables: { cv: { cvId } },
        // Умное удаление из кэша Apollo без лишних запросов на сервер
        update: (cache) => {
          cache.evict({ id: cache.identify({ __typename: "Cv", id: cvId }) });
          cache.gc();
        },
      });
      toast.success("CV deleted successfully!", { id: loadingToast });
    } catch {
      toast.error("Failed to delete CV", { id: loadingToast });
    }
  };

  const handleCreateCv = async (name: string, description: string, education?: string) => {
    if (!userId) return null;
    const loadingToast = toast.loading("Creating CV...");
    try {
      const { data } = await createCvMutation({
        variables: { cv: { name, description, education, userId } },
      });
      toast.success("CV created!", { id: loadingToast });
      return data?.createCv;
    } catch {
      toast.error("Failed to create CV", { id: loadingToast });
    }
  };

  return {
    cvs: filteredAndSortedCvs,
    userEmail: data?.user?.email,
    totalCount: rawCvs.length,
    loading: isLoadingCvs,
    isCreating,
    isDeleting,
    searchTerm,
    setSearchTerm,
    sortDirection,
    handleToggleSort,
    deleteCv: handleDeleteCv,
    createCv: handleCreateCv,
  };
}