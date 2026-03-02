"use client";

import { useState, useRef, useSyncExternalStore } from "react";
import { Upload } from "lucide-react";
import { useParams } from "next/navigation"; // Хук для получения ID из URL
import { useUserStore } from "@/store/useUserStore";
import { useQuery, useMutation } from "@apollo/client/react";
import { 
  GET_DEPARTMENTS_QUERY, 
  GET_POSITIONS_QUERY,
  UPDATE_PROFILE_MUTATION,
  UPLOAD_AVATAR_MUTATION,
  UPDATE_USER_MUTATION,
} from "./graphql";
import { User } from '@/types/user.types';

// =========================================================================
// СТРОГИЕ ТИПЫ ДЛЯ GRAPHQL
// =========================================================================
interface Department { id: string; name: string; }
interface Position { id: string; name: string; }

interface UploadAvatarResponse {
  uploadAvatar: string;
}

interface UpdateProfileResponse {
  updateProfile: {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string;
  };
}

interface UpdateUserResponse {
  updateUser: {
    id: string;
    department_name: string;
    position_name: string;
  };
}

// =========================================================================
// ЗАЩИТА HYDRATION ДЛЯ NEXT.JS (SSR/SSG)
// =========================================================================
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1]; 
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// =========================================================================
// 1. КОМПОНЕНТ-ОБЕРТКА
// =========================================================================
export default function ProfileForm() {
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const { user } = useUserStore();
  const params = useParams(); 

  if (!isClient || !user) {
    return (
      <div className="w-full max-w-[900px] mx-auto py-8 px-4 flex flex-col items-center animate-pulse" data-testid="profile-skeleton">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-8"></div>
        <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
        <div className="w-32 h-4 bg-gray-200 rounded mb-10"></div>
        <div className="w-full max-w-[700px] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-12 bg-gray-100 rounded-md"></div>
          <div className="h-12 bg-gray-100 rounded-md"></div>
          <div className="h-12 bg-gray-100 rounded-md"></div>
          <div className="h-12 bg-gray-100 rounded-md"></div>
        </div>
      </div>
    );
  }

  // AC-4: Проверяем, чей это профиль. 
  // Вытаскиваем ID из параметров маршрута (например, /users/123/profile)
  const profileUserId = params?.userId as string | undefined;
  
  // Если ID в URL есть и он НЕ совпадает с ID текущего пользователя - включаем Read-Only
  // P.S. Если нужно дать права админу, можно расширить: && user.role !== 'Admin'
  const isReadOnly = Boolean(profileUserId && profileUserId !== user.id);

  return <ProfileFormContent key={user.email || 'form'} user={user} isReadOnly={isReadOnly} />;
}

// =========================================================================
// 2. ВНУТРЕННИЙ КОМПОНЕНТ (ФОРМА)
// =========================================================================
function ProfileFormContent({ user, isReadOnly }: { user: User, isReadOnly: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setLogin } = useUserStore(); 

  const [firstName, setFirstName] = useState(user.profile?.first_name || "");
  const [lastName, setLastName] = useState(user.profile?.last_name || "");
  const [department, setDepartment] = useState(user.department_name || "");
  const [position, setPosition] = useState(user.position_name || "");
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.profile?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Глобальный errorLink сам обработает 401 ошибки. Компоненту о них знать не нужно.
  const { data: deptData, loading: deptLoading } = useQuery<{ departments: Department[] }>(GET_DEPARTMENTS_QUERY);
  const { data: posData, loading: posLoading } = useQuery<{ positions: Position[] }>(GET_POSITIONS_QUERY);
  
  const [updateProfile] = useMutation<UpdateProfileResponse>(UPDATE_PROFILE_MUTATION);
  const [uploadAvatar] = useMutation<UploadAvatarResponse>(UPLOAD_AVATAR_MUTATION);
  const [updateUser] = useMutation<UpdateUserResponse>(UPDATE_USER_MUTATION);

  const userInitial = firstName ? firstName.charAt(0).toUpperCase() : (user.email?.charAt(0).toUpperCase() || "U");
  const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "User Name";
  const email = user.email || "";
  const formattedDate = user.created_at ? new Date(Number(user.created_at)).toDateString() : "Sun Jan 14 2024"; 

  const isDirty = 
    firstName !== (user.profile?.first_name || "") ||
    lastName !== (user.profile?.last_name || "") ||
    department !== (user.department_name || "") ||
    position !== (user.position_name || "") ||
    avatarFile !== null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
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
              type: avatarFile.type
            }
          }
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
            last_name: lastName
          }
        }
      });
      const updatedProfileData = profileRes.data?.updateProfile;

      const selectedDeptId = deptData?.departments.find(d => d.name === department)?.id;
      const selectedPosId = posData?.positions.find(p => p.name === position)?.id;

      let updatedDepartmentName = user.department_name;
      let updatedPositionName = user.position_name;

      if (selectedDeptId || selectedPosId) {
        const userRes = await updateUser({
          variables: {
            user: {
              userId: user.id, 
              departmentId: selectedDeptId,
              positionId: selectedPosId
            }
          }
        });
        
        if (userRes.data?.updateUser) {
          updatedDepartmentName = userRes.data.updateUser.department_name;
          updatedPositionName = userRes.data.updateUser.position_name;
        }
      }

      if (updatedProfileData) {
        const updatedUser: User = {
          ...user,
          department_name: updatedDepartmentName,
          position_name: updatedPositionName,
          profile: {
            ...user.profile,
            first_name: updatedProfileData.first_name,
            last_name: updatedProfileData.last_name,
            avatar: finalAvatarUrl || updatedProfileData.avatar
          }
        };

        setLogin(updatedUser);
      }

      setAvatarFile(null);
      alert("Данные успешно сохранены в базе!");

    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      alert("Ошибка при сохранении. Проверь консоль.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto py-8 px-4 flex flex-col items-center">
      
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#C8372D] flex items-center justify-center text-white text-3xl font-medium overflow-hidden shrink-0 shadow-sm bg-opacity-30">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 bg-gray-300 w-full h-full flex items-center justify-center">{userInitial}</span>
          )}
        </div>

        <div className="flex flex-col items-start text-sm">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            // Блокируем кнопку загрузки, если чужой профиль
            className={`flex items-center gap-2 font-semibold mb-1 transition-colors ${
              isReadOnly ? "text-gray-400 cursor-not-allowed" : "text-gray-900 hover:text-red-700"
            }`}
            disabled={isSubmitting || isReadOnly}
          >
            <Upload size={18} />
            Upload avatar image
          </button>
          <span className="text-gray-500 text-xs md:text-sm">png, jpg or gif no more than 0.5MB</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/gif" 
            className="hidden" 
            disabled={isReadOnly}
            data-testid="avatar-upload-input"
          />
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-1">{fullName}</h2>
        <p className="text-gray-500 text-sm mb-1">{email}</p>
        <p className="text-gray-400 text-xs">A member since {formattedDate}</p>
      </div>

      <form className="w-full max-w-[700px] flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <FloatingInput 
            label="First Name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            disabled={isReadOnly} 
          />
          <FloatingInput 
            label="Last Name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            disabled={isReadOnly} 
          />
          
          <FloatingSelect 
            label="Department" 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)}
            options={deptData?.departments || []}
            loading={deptLoading}
            disabled={isReadOnly} 
          />
          <FloatingSelect 
            label="Position" 
            value={position} 
            onChange={(e) => setPosition(e.target.value)}
            options={posData?.positions || []}
            loading={posLoading}
            disabled={isReadOnly} 
          />
        </div>

        {/* Скрываем кнопку Update полностью, если профиль чужой */}
        {!isReadOnly && (
          <div className="flex justify-center mt-4">
            <button
              type="button" 
              onClick={handleUpdate}
              disabled={!isDirty || isSubmitting}
              className={`w-full max-w-[700px] font-medium py-3 rounded-full uppercase text-sm tracking-wide transition-colors ${
                (isDirty && !isSubmitting)
                  ? "bg-red-700 text-white hover:bg-red-800 shadow-md" 
                  : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        )}
        
      </form>
    </div>
  );
}

// =========================================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// =========================================================================

function FloatingInput({ label, value, onChange, type = "text", disabled }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, disabled?: boolean }) {
  return (
    <div className="relative w-full">
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        disabled={disabled}
        placeholder=" " 
        className={`peer w-full border border-gray-300 rounded-md bg-transparent px-3 py-2.5 text-sm focus:border-gray-500 focus:outline-none focus:ring-0 transition-colors ${
          disabled ? "text-gray-400 bg-gray-50 cursor-not-allowed" : "text-gray-900"
        }`} 
      />
      <label className={`absolute left-3 -top-2.5 bg-[#F8F8F8] px-1 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs pointer-events-none ${
        disabled ? "text-gray-400" : "text-gray-500 peer-focus:text-gray-900"
      }`}>
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({ label, value, onChange, options, loading, disabled }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { id: string, name: string }[], loading?: boolean, disabled?: boolean }) {
  let placeholderText = "";
  if (loading) placeholderText = "Loading...";
  else if (options.length === 0) placeholderText = "No data found";

  // Компонент заблокирован, если идет загрузка, нет опций, или передано read-only
  const isDisabled = loading || options.length === 0 || disabled;

  return (
    <div className="relative w-full">
      <select 
        value={value} 
        onChange={onChange} 
        disabled={isDisabled} 
        className={`peer w-full border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-0 appearance-none transition-colors disabled:cursor-not-allowed ${
          isDisabled ? "border-gray-200 text-gray-400 bg-gray-50" : "border-gray-300 text-gray-900 bg-transparent focus:border-gray-500"
        }`}
      >
        <option value="" disabled hidden>{placeholderText}</option>
        {options.map((opt) => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
      </select>
      <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDisabled ? "text-gray-300" : "text-gray-400"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <label className={`absolute left-3 -top-2.5 bg-[#F8F8F8] px-1 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs pointer-events-none ${
        isDisabled ? "text-gray-400" : "text-gray-500 peer-focus:text-gray-900"
      }`}>
        {label}
      </label>
    </div>
  );
}