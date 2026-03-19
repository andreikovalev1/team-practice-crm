"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";
import { GetCvByIdResponse, UpdateCvResponse } from "@/features/cvs/types";
import { GET_CV_BY_ID_QUERY, UPDATE_CV_MUTATION } from "@/features/cvs/graphql";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";

function CvDetailsForm({ cv }: { cv: NonNullable<GetCvByIdResponse["cv"]> }) {
    const { user: currentUser} = useIsOwnProfile();
    const isOwner = currentUser?.id === cv.user?.id;
    const isAdmin = currentUser?.role === "Admin";
    const isReadOnly = !isOwner && !isAdmin;
  
    const initialData = {
    name: cv.name || "",
    education: cv.education || "",
    description: cv.description || ""
  };

  const [formData, setFormData] = useState(initialData);

  const [updateCv, { loading: isUpdating }] = useMutation<UpdateCvResponse>(UPDATE_CV_MUTATION, {
    onCompleted: () => toast.success("CV updated successfully!"),
  })
  const isDirty = 
    formData.name !== initialData.name ||
    formData.education !== initialData.education ||
    formData.description !== initialData.description;

  const isValid = 
    formData.name.trim() !== "" && 
    formData.education.trim() !== "" && 
    formData.description.trim() !== "";

  const isButtonDisabled = !isValid || !isDirty || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonDisabled || isReadOnly) return;
    try {
      await updateCv({
        variables: {
          cv: {
            cvId: cv.id,
            name: formData.name,
            education: formData.education,
            description: formData.description,
          },
        },
      });
    } catch (err) {
      toast.error("Update failed: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  return (
    <div className="flex justify-center w-full px-4 md:px-0 md:py-10">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full flex flex-col gap-8 mx-auto">
        <FloatingInput 
          label="Name"
          value={formData.name}
          disabled={isReadOnly}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
        <FloatingInput 
          label="Education"
          value={formData.education}
          disabled={isReadOnly}
          onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
        />
        
        <div className="relative w-full">
           <textarea
             value={formData.description}
             disabled={isReadOnly}
             onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
             placeholder=" "
             rows={6}
             className={`peer w-full border border-gray-300 px-3 py-3 text-sm outline-none transition-all resize-none break-words${
              isReadOnly ? "bg-gray-50 cursor-default" : "focus:border-red-700"
            }`}
           />
           <label className="absolute left-3 top-3 bg-white px-1 text-sm text-gray-500 transition-all peer-focus:-translate-y-5 peer-not-placeholder-shown:-translate-y-5 peer-focus:text-xs peer-focus:text-red-700 pointer-events-none">
             Description
           </label>
        </div>
        
        {!isReadOnly && (
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
            <div className="hidden md:block" />
            <OvalButton 
            type="submit" 
            text={isUpdating ? "SAVING..." : "UPDATE"} 
            disabled={isButtonDisabled}
            className="w-full max-w-[320px] md:max-w-none"
            />
        </div>
        )}
      </form>
    </div>
  );
}

export default function CvDetailsPage() {
  const params = useParams();
  const cvId = typeof params?.cvId === "string" ? params.cvId : "";
  const { data, loading } = useQuery<GetCvByIdResponse>(GET_CV_BY_ID_QUERY, {
    variables: { cvId },
    skip: !cvId,
  });

  if (loading) return <div className="p-6">Loading CV data...</div>;
  if (!data?.cv) return <div className="p-6 text-red-500">CV not found</div>;

  return <CvDetailsForm cv={data.cv} key={cvId} />;
}