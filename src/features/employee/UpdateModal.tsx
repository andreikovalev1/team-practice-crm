"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal"; 
import FloatingInput from "@/components/FloatingInput"; 
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton"

import { 
  UPDATE_USER_MUTATION,
  GET_DEPARTMENTS_QUERY, 
  GET_POSITIONS_QUERY 
} from "./graphql";
import { 
  UserRole,
  GetDepartmentsResponse,
  GetPositionsResponse,
  Department,
  Position
} from "./types";
import { User } from "@/types/user.types";

const ROLE_OPTIONS = [
  { id: "Employee", name: "Employee" },
  { id: "Admin", name: "Admin" },
];

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User; 
}

export default function UpdateModal({ isOpen, onClose, user }: UpdateModalProps) {
  const router = useRouter();
  
  const initialRole = (user.role as UserRole) || "Employee";
  const initialDept = user.department_name || "";
  const initialPos = user.position_name || "";

  const [formData, setFormData] = useState({
    firstName: user.profile?.first_name || "",
    lastName: user.profile?.last_name || "",
    departmentName: initialDept, 
    positionName: initialPos,
    role: initialRole,
  });

  const { data: deptData, loading: loadingDepts } = useQuery<GetDepartmentsResponse>(GET_DEPARTMENTS_QUERY, {
    skip: !isOpen,
  });
  
  const { data: posData, loading: loadingPos } = useQuery<GetPositionsResponse>(GET_POSITIONS_QUERY, {
    skip: !isOpen,
  });

  const [updateUser, { loading: isUpdating }] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: ["GetUsers"],
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating user...");

    const finalDeptId = deptData?.departments.find((d: Department) => d.name === formData.departmentName)?.id;
    const finalPosId = posData?.positions.find((p: Position) => p.name === formData.positionName)?.id;

    try {
      const extendedUser = user as User & { cvs?: { id: string }[] };

      await updateUser({
        variables: {
          user: {
            userId: user.id,
            role: formData.role,
            departmentId: finalDeptId || null,
            positionId: finalPosId || null,
            cvsIds: extendedUser.cvs?.map(cv => cv.id) || []
          }
        },
      });
      
      toast.success("User updated successfully!", { id: loadingToast });
      onClose();
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update user", { id: loadingToast });
    }
  };

  const isLoadingData = loadingDepts || loadingPos;

  const isChanged = 
    formData.role !== initialRole ||
    formData.departmentName !== initialDept ||
    formData.positionName !== initialPos;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update user`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput
            label="Email" type="email" value={user.email}
            onChange={() => {}} required disabled
          />
          <FloatingInput
            label="Password" type="password" value="********"
            onChange={() => {}} required disabled
          />
          <FloatingInput
            label="First Name" type="text" value={formData.firstName}
            onChange={() => {}} required disabled
          />
          <FloatingInput
            label="Last Name" type="text" value={formData.lastName}
            onChange={() => {}} required disabled
          />

          <FloatingSelect
            label={loadingDepts ? "Loading..." : "Department"}
            options={deptData?.departments || []}
            value={formData.departmentName}
            onChange={(selectedName) => handleChange("departmentName", selectedName)}
            disabled={isUpdating || loadingDepts}
          />
          <FloatingSelect
            label={loadingPos ? "Loading..." : "Position"}
            options={posData?.positions || []}
            value={formData.positionName}
            onChange={(selectedName) => handleChange("positionName", selectedName)}
            disabled={isUpdating || loadingPos}
          />
        </div>

        <div className="w-full mt-2">
           <FloatingSelect
            label="Role" options={ROLE_OPTIONS} value={formData.role}
            onChange={(val) => handleChange("role", val as UserRole)}
            disabled={isUpdating}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-zinc-200 w-full">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isUpdating}
            className="w-full"
          />

          <OvalButton
            text={isUpdating ? "Updating..." : "Update"}
            type="submit"
            disabled={isUpdating || isLoadingData || !isChanged}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}