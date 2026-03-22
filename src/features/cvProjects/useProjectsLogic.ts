"use client";

import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useCvStore } from "@/store/useCvStore"; 
import { 
  ADD_CV_PROJECT, 
  UPDATE_CV_PROJECT, 
  REMOVE_CV_PROJECT 
} from "./graphql";
import { 
  AddCvProjectInput, 
  UpdateCvProjectInput, 
  RemoveCvProjectInput, 
  CvProjectUpdateResponse 
} from "./types";

export function useProjectsLogic(cvId: string) {
  const setCvProjects = useCvStore((state) => state.setCvProjects);
  const removeCvProject = useCvStore((state) => state.removeCvProject);

  const [addCvProjectMut, { loading: isAdding }] = useMutation<CvProjectUpdateResponse>(ADD_CV_PROJECT, {
    onCompleted: (data) => {
      if (data?.addCvProject?.projects) {
        setCvProjects(cvId, data.addCvProject.projects);
      }
      toast.success("Project added to CV successfully!");
    },
    onError: (err) => toast.error(`Failed to add project: ${err.message}`),
  });

  const [updateCvProjectMut, { loading: isUpdating }] = useMutation<CvProjectUpdateResponse>(UPDATE_CV_PROJECT, {
    onCompleted: (data) => {
      if (data?.updateCvProject?.projects) {
        setCvProjects(cvId, data.updateCvProject.projects);
      }
      toast.success("Project updated successfully!");
    },
    onError: (err) => toast.error(`Failed to update project: ${err.message}`),
  });

  const [removeCvProjectMut, { loading: isRemoving }] = useMutation<CvProjectUpdateResponse>(REMOVE_CV_PROJECT, {
    onCompleted: (_, options) => {
      const variables = options?.variables?.project as RemoveCvProjectInput;
      const projectId = variables?.projectId;

      if (projectId) {
        removeCvProject(cvId, projectId);
      }
      toast.success("Project removed from CV!");
    },
    onError: (err) => toast.error(`Failed to remove project: ${err.message}`),
  });

  const handleAddProject = async (input: Omit<AddCvProjectInput, "cvId">) => {
    await addCvProjectMut({ variables: { project: { cvId, ...input } } });
  };

  const handleUpdateProject = async (input: Omit<UpdateCvProjectInput, "cvId">) => {
    await updateCvProjectMut({ variables: { project: { cvId, ...input } } });
  };

  const handleRemoveProject = async (projectId: string) => {
    const input: RemoveCvProjectInput = { cvId, projectId };
    await removeCvProjectMut({ variables: { project: input } });
  };

  return {
    handleAddProject,
    handleUpdateProject,
    handleRemoveProject,
    isMutating: isAdding || isUpdating || isRemoving,
  };
}