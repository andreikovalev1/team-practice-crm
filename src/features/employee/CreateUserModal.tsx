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
  CREATE_USER_MUTATION, 
  GET_DEPARTMENTS_QUERY, 
  GET_POSITIONS_QUERY 
} from "./graphql";
import { 
  CreateUserFormData,
  UserRole,
  GetDepartmentsResponse,
  GetPositionsResponse 
} from "./types";

const ROLE_OPTIONS = [
  { id: "Employee", name: "Employee" },
  { id: "Admin", name: "Admin" },
];

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    departmentId: "",
    positionId: "",
    role: "Employee" as UserRole,
  });

  const { data: deptData, loading: loadingDepts } = useQuery<GetDepartmentsResponse>(GET_DEPARTMENTS_QUERY, {
    skip: !isOpen,
  });
  
  const { data: posData, loading: loadingPos } = useQuery<GetPositionsResponse>(GET_POSITIONS_QUERY, {
    skip: !isOpen,
  });

  const [createUser, { loading: isCreating }] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: ["GetUsers"],
  });

  const handleChange = (field: keyof CreateUserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating user...");

    try {
      await createUser({
        variables: {
          user: {
            auth: {
              email: formData.email,
              password: formData.password,
            },
            profile: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
            cvsIds: [],
            role: formData.role,
            departmentId: formData.departmentId || null,
            positionId: formData.positionId || null,
          }
        },
      });
      
      toast.success("User created successfully!", { id: loadingToast });
      
      setFormData({
        email: "", password: "", firstName: "", lastName: "",
        departmentId: "", positionId: "", role: "Employee",
      });
      onClose();
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to create user", { id: loadingToast });
    }
  };

  const isFormValid = formData.email && formData.password && formData.firstName && formData.lastName;
  const isLoadingData = loadingDepts || loadingPos;
  
  const currentDeptName = deptData?.departments.find(d => d.id === formData.departmentId)?.name || "";
  const currentPosName = posData?.positions.find(p => p.id === formData.positionId)?.name || "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create user">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput
            label="Email" type="email" value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required disabled={isCreating}
          />
          <FloatingInput
            label="Password" type="password" value={formData.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            required disabled={isCreating}
          />
          <FloatingInput
            label="First Name" type="text" value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required disabled={isCreating}
          />
          <FloatingInput
            label="Last Name" type="text" value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required disabled={isCreating}
          />
          <FloatingSelect
            label={loadingDepts ? "Loading..." : "Department"}
            options={deptData?.departments || []}
            value={currentDeptName}
            onChange={(selectedName) => {
               const dept = deptData?.departments.find(d => d.name === selectedName);
               if (dept) handleChange("departmentId", dept.id);
            }}
            disabled={isCreating || loadingDepts}
          />
          <FloatingSelect
            label={loadingPos ? "Loading..." : "Position"}
            options={posData?.positions || []}
            value={currentPosName}
            onChange={(selectedName) => {
               const pos = posData?.positions.find(p => p.name === selectedName);
               if (pos) handleChange("positionId", pos.id);
            }}
            disabled={isCreating || loadingPos}
          />
        </div>

        <div className="w-full mt-2">
           <FloatingSelect
            label="Role" options={ROLE_OPTIONS} value={formData.role}
            onChange={(val) => handleChange("role", val as UserRole)}
            disabled={isCreating}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-zinc-200 w-full">
          <OvalButton
            text="Cancel"
            type="button"
            variant="ovalOutline"
            onClick={onClose}
            disabled={isCreating}
            className="w-full"
          />

          <OvalButton
            text={isCreating ? "Creating..." : "Create"}
            type="submit"
            disabled={isCreating || !isFormValid || isLoadingData}
            className="w-full"
          />
        </div>
      </form>
    </Modal>
  );
}