import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import {
  GET_USER_CVS_QUERY,
  CREATE_CV_MUTATION,
  DELETE_CV_MUTATION,
  GET_GLOBAL_CVS_QUERY,
} from "./graphql";
import { Cv, CvForTable, GetGlobalCVsResponse, GetUserCvsResponse, CreateCvInput, CreateCvResponse, DeleteCvInput, DeleteCvResponse, UpdateCvInput, UpdateCvResponse } from "./types";

const EMPTY_CVS: CvForTable[] = [];

export function useCvsLogic(userId?: string, mode: "user" | "global" = "user") {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: userData, loading: isLoadingUser } = useQuery<GetUserCvsResponse>(
    GET_USER_CVS_QUERY,
    { variables: { userId }, skip: mode !== "user" || !userId }
  );

  const { data: globalData, loading: isLoadingGlobal } = useQuery<GetGlobalCVsResponse>(
    GET_GLOBAL_CVS_QUERY,
    { skip: mode !== "global" }
  );

  const [createCvMutation, { loading: isCreating }] = useMutation<CreateCvResponse, { cv: CreateCvInput }>(
    CREATE_CV_MUTATION,
    { refetchQueries: [{ query: mode === "user" ? GET_USER_CVS_QUERY : GET_GLOBAL_CVS_QUERY, variables: mode === "user" ? { userId } : undefined }] }
  );

  const [deleteCvMutation, { loading: isDeleting }] = useMutation<DeleteCvResponse, { cv: DeleteCvInput }>(
    DELETE_CV_MUTATION
  );

const cvs: CvForTable[] = useMemo(() => {
  if (mode === "user") {
    return (userData?.user?.cvs || []).map(cv => ({
      ...cv,
      userId: userData?.user.id,
      userEmail: userData?.user.email,
    }));
  } else {

    return (globalData?.cvs || []).map(cv => ({
      id: cv.id,
      name: cv.name,
      description: cv.description,
      education: cv.education,
      userId: cv.user?.id,
      userEmail: cv.user?.email,
    }));
  }
}, [userData, globalData, mode]);

  const loading = mode === "user" ? isLoadingUser : isLoadingGlobal;

  // --- Фильтрация и сортировка ---
  const filteredAndSortedCvs = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = cvs.filter(cv =>
      cv.name.toLowerCase().includes(lowerTerm) ||
      cv.description.toLowerCase().includes(lowerTerm)
    );
    return filtered.sort((a, b) => {
      const comp = a.name.localeCompare(b.name);
      return sortDirection === "asc" ? comp : -comp;
    });
  }, [cvs, searchTerm, sortDirection]);

  const handleToggleSort = () => setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));

  const deleteCv = async (cvId: string) => {
    const toastId = toast.loading("Deleting CV...");
    try {
      await deleteCvMutation({
        variables: { cv: { cvId } },
        update: cache => {
          cache.evict({ id: cache.identify({ __typename: "Cv", id: cvId }) });
          cache.gc();
        }
      });
      toast.success("CV deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete CV", { id: toastId });
    }
  };

  const createCv = async (name: string, description: string, education?: string) => {
    if (!userId) return null;
    const toastId = toast.loading("Creating CV...");
    try {
      const { data } = await createCvMutation({ variables: { cv: { name, description, education, userId } } });
      toast.success("CV created", { id: toastId });
      return data?.createCv;
    } catch {
      toast.error("Failed to create CV", { id: toastId });
    }
  };

  return {
    cvs: filteredAndSortedCvs,
    loading,
    searchTerm,
    setSearchTerm,
    sortDirection,
    handleToggleSort,
    deleteCv,
    createCv,
    isCreating,
    isDeleting
  };
}