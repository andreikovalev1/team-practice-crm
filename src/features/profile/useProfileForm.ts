import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUserStore";
import { User } from "@/types/user.types";
import { fileToBase64 } from "@/lib/utils";
import {
  GET_DEPARTMENTS_QUERY,
  GET_POSITIONS_QUERY,
  UPDATE_PROFILE_MUTATION,
  UPLOAD_AVATAR_MUTATION,
  UPDATE_USER_MUTATION,
} from "./graphql";
import {
  Department,
  Position,
  UpdateProfileResponse,
  UploadAvatarResponse,
  UpdateUserResponse,
} from "./types";

export function useProfileFormLogic(user: User, isReadOnly: boolean) {
  const { setLogin } = useUserStore();

  // Состояния полей
  const [firstName, setFirstName] = useState(user.profile?.first_name || "");
  const [lastName, setLastName] = useState(user.profile?.last_name || "");
  const [department, setDepartment] = useState(user.department_name || "");
  const [position, setPosition] = useState(user.position_name || "");

  // Состояния аватара и загрузки
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.profile?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Справочники
  const { data: deptData } = useQuery<{ departments: Department[] }>(GET_DEPARTMENTS_QUERY);
  const { data: posData } = useQuery<{ positions: Position[] }>(GET_POSITIONS_QUERY);

  // Мутации
  const [updateProfile] = useMutation<UpdateProfileResponse>(UPDATE_PROFILE_MUTATION);
  const [uploadAvatar] = useMutation<UploadAvatarResponse>(UPLOAD_AVATAR_MUTATION);
  const [updateUser] = useMutation<UpdateUserResponse>(UPDATE_USER_MUTATION);

  // Проверка на изменения
  const isDirty = useMemo(() => (
    firstName !== (user.profile?.first_name || "") ||
    lastName !== (user.profile?.last_name || "") ||
    department !== (user.department_name || "") ||
    position !== (user.position_name || "") ||
    avatarFile !== null
  ), [firstName, lastName, department, position, avatarFile, user]);

  const handleUpdate = async () => {
    if (isReadOnly) return;
    const loadingToast = toast.loading("Сохранение изменений...");
    setIsSubmitting(true);

    try {
      let finalAvatarUrl = user.profile?.avatar || "";

      // 1. Загрузка аватара если есть файл
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

      // 2. Обновление профиля
      const profileRes = await updateProfile({
        variables: {
          profile: {
            userId: user.id,
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      // 3. Обновление системных данных (Департамент/Должность)
      const selectedDeptId = deptData?.departments.find((d) => d.name === department)?.id;
      const selectedPosId = posData?.positions.find((p) => p.name === position)?.id;

      let updatedDeptName = user.department_name;
      let updatedPosName = user.position_name;

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
          updatedDeptName = userRes.data.updateUser.department_name ?? undefined;
          updatedPosName = userRes.data.updateUser.position_name ?? undefined;
        }
      }

      // 4. Синхронизация со стором
      setLogin({
        ...user,
        department_name: updatedDeptName || user.department_name,
        position_name: updatedPosName || user.position_name,
        profile: {
          ...user.profile,
          first_name: profileRes.data?.updateProfile.first_name ?? firstName,
          last_name: profileRes.data?.updateProfile.last_name ?? lastName,
          avatar: finalAvatarUrl,
        },
      });

      setAvatarFile(null);
      toast.success("Profile updated successful", { id: loadingToast });
    } catch {
      toast.error("Failed to save changes", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    firstName, setFirstName,
    lastName, setLastName,
    department, setDepartment,
    position, setPosition,
    avatarPreview, setAvatarPreview,
    avatarFile, setAvatarFile,
    isSubmitting,
    isDirty,
    deptData,
    posData,
    handleUpdate
  };
}