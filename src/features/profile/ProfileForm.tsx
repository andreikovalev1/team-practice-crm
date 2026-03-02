"use client";

import { useState, useRef, useSyncExternalStore } from "react";
import { Upload } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams } from "next/navigation";
import {
  GET_DEPARTMENTS_QUERY,
  GET_POSITIONS_QUERY,
  UPDATE_PROFILE_MUTATION,
  UPLOAD_AVATAR_MUTATION,
  GET_USER_BY_ID_QUERY,
  UPDATE_USER_MUTATION,
} from "./graphql";
import { User } from "@/types/user.types";
import toast from "react-hot-toast";

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  name: string;
}

interface UploadAvatarResponse {
  uploadAvatar: string;
}

interface UpdateProfileResponse {
  updateProfile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
  };
}

interface UpdateUserResponse {
  updateUser: {
    id: string;
    department_name: string | null;
    position_name: string | null;
  };
}

interface GetUserByIdResponse {
  user: User;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function ProfileForm() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const { user } = useUserStore();
  const params = useParams();
  const profileUserId = params?.userId as string | undefined;

  const isOwnProfile =
    !!user && (!profileUserId || profileUserId === user.id);

  const { data: profileData } = useQuery<GetUserByIdResponse>(
    GET_USER_BY_ID_QUERY,
    {
      variables: { userId: profileUserId },
      skip: isOwnProfile || !profileUserId || !user,
    }
  );

  if (!isClient || !user) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const profileUser = isOwnProfile ? user : profileData?.user;

  if (!profileUser) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <ProfileFormContent
      key={profileUser.id}
      user={profileUser}
      isReadOnly={!isOwnProfile}
    />
  );
}

function ProfileFormContent({
  user,
  isReadOnly,
}: {
  user: User;
  isReadOnly: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLogin } = useUserStore();

  const [firstName, setFirstName] = useState(
    user.profile?.first_name || ""
  );
  const [lastName, setLastName] = useState(
    user.profile?.last_name || ""
  );
  const [department, setDepartment] = useState(
    user.department_name || ""
  );
  const [position, setPosition] = useState(
    user.position_name || ""
  );

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.profile?.avatar || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: deptData } = useQuery<{
    departments: Department[];
  }>(GET_DEPARTMENTS_QUERY);

  const { data: posData } = useQuery<{
    positions: Position[];
  }>(GET_POSITIONS_QUERY);

  const [updateProfile] =
    useMutation<UpdateProfileResponse>(UPDATE_PROFILE_MUTATION);
  const [uploadAvatar] =
    useMutation<UploadAvatarResponse>(UPLOAD_AVATAR_MUTATION);
  const [updateUser] =
    useMutation<UpdateUserResponse>(UPDATE_USER_MUTATION);

  const isDirty =
    firstName !== (user.profile?.first_name || "") ||
    lastName !== (user.profile?.last_name || "") ||
    department !== (user.department_name || "") ||
    position !== (user.position_name || "") ||
    avatarFile !== null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (isReadOnly) return;

    const loadingToast = toast.loading("Сохранение изменений...");
    setIsSubmitting(true);

    try {
      let finalAvatarUrl = user.profile?.avatar || "";

      if (avatarFile) {
        const base64Data = await fileToBase64(avatarFile);

        const avatarRes = await uploadAvatar({
          variables: {
            avatar: {
              userId: user.id,
              base64: base64Data,
              size: avatarFile.size,
              type: avatarFile.type,
            },
          },
        });

        if (avatarRes.data?.uploadAvatar) {
          finalAvatarUrl = avatarRes.data.uploadAvatar;
        }
      }

      const profileRes = await updateProfile({
        variables: {
          profile: {
            userId: user.id,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      const selectedDeptId =
        deptData?.departments.find(
          (d) => d.name === department
        )?.id;

      const selectedPosId =
        posData?.positions.find(
          (p) => p.name === position
        )?.id;

      let updatedDepartmentName = user.department_name;
      let updatedPositionName = user.position_name;

      if (selectedDeptId || selectedPosId) {
        const userRes = await updateUser({
          variables: {
            user: {
              userId: user.id,
              departmentId: selectedDeptId,
              positionId: selectedPosId,
            },
          },
        });

        if (userRes.data?.updateUser) {
          updatedDepartmentName =
            userRes.data.updateUser.department_name ?? undefined;
          updatedPositionName =
            userRes.data.updateUser.position_name ?? undefined;
        }
      }

      setLogin({
        ...user,
        department_name:
          updatedDepartmentName || user.department_name,
        position_name:
          updatedPositionName || user.position_name,
        profile: {
          ...user.profile,
          first_name:
            profileRes.data?.updateProfile.first_name ??
            firstName,
          last_name:
            profileRes.data?.updateProfile.last_name ??
            lastName,
          avatar: finalAvatarUrl,
        },
      });

      setAvatarFile(null);

      toast.success("Профиль успешно обновлён", {
        id: loadingToast,
      });
    } catch {
      toast.error("Не удалось сохранить изменения", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto py-8 px-4">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        {!isReadOnly && (
          <>
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="flex items-center gap-2 text-gray-900 hover:text-red-700"
            >
              <Upload size={18} />
              Upload avatar
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>

      {!isReadOnly && (
        <button
          type="button"
          onClick={handleUpdate}
          disabled={!isDirty || isSubmitting}
          className="bg-red-700 text-white px-6 py-2 rounded-full disabled:bg-gray-300"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      )}
    </div>
  );
}