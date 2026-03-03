"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Upload, Trash2 } from "lucide-react";
// import { useQuery } from "@apollo/client/react";
// import { GET_USER_BY_ID_QUERY } from "./graphql";
import { User } from "@/types/user.types";
import FloatingInput from "@/components/FloatingInput";
import FloatingSelect from "@/components/FloatingSelect";
import { useProfileFormLogic } from "./useProfileForm";
// import { GetUserByIdResponse } from "./types";
import Image from "next/image";
import toast from "react-hot-toast";
// import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";

import { useProfileUser } from "./useProfileUser";

// const emptySubscribe = () => () => {};
// const getClientSnapshot = () => true;
// const getServerSnapshot = () => false;

export default function ProfileForm() {
  // const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  // const { user, profileUserId, isOwnProfile } = useIsOwnProfile();

  // const { data: profileData } = useQuery<GetUserByIdResponse>(
  //   GET_USER_BY_ID_QUERY,
  //   {
  //     variables: { userId: profileUserId },
  //     skip: isOwnProfile || !profileUserId || !user,
  //   }
  // );

  // if (!isClient || !user) return <div className="p-10 text-center">Loading...</div>;

  // const profileUser = isOwnProfile ? user : profileData?.user;
  // if (!profileUser) return <div className="p-10 text-center">Loading profile...</div>;

  // return <ProfileFormContent key={profileUser.id} user={profileUser} isReadOnly={!isOwnProfile} />;
  const { isClient, profileUser, isOwnProfile, loading } = useProfileUser();

  if (!isClient || loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!profileUser) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <ProfileFormContent key={profileUser.id} user={profileUser} isReadOnly={!isOwnProfile} />
  );
}

function ProfileFormContent({ user, isReadOnly }: { user: User; isReadOnly: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logic = useProfileFormLogic(user, isReadOnly);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.size > 500 * 1024) {
        toast.error("The file is too large. Max size is 500KB");
        return;
    }
    logic.setAvatarFile(file);
    logic.setAvatarPreview(URL.createObjectURL(file));
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isReadOnly) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isReadOnly) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    } else if (file) {
      toast.error("Пожалуйста, загрузите изображение (PNG, JPG или GIF)");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      logic.setAvatarFile(file);
      logic.setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const formattedDate = user.created_at ? new Date(Number(user.created_at)).toDateString() : "";

  return (
    <div className="w-full max-w-[900px] mx-auto py-8 px-6 flex flex-col items-center">
      {/* Аватар */}
      <div className="flex items-center gap-6 mb-8">
        {/* Контейнер аватара, теперь с group для ховера */}
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center group transition-all border-2
            ${!isReadOnly ? "cursor-pointer hover:border-[#C8372D]" : "border-transparent"}
            ${isDragging ? "border-[#C8372D] scale-105 bg-red-50" : "bg-gray-200 border-transparent"}
          `}
        >
            {logic.avatarPreview ? (
                <>
                    <Image 
                    src={logic.avatarPreview} 
                    alt="Avatar" 
                    fill
                    className="object-cover transition-all duration-300 group-hover:blur-sm" // Добавлен блюр при ховере
                    priority
                    unoptimized
                    />
                    {/* Кнопка удаления поверх картинки, появляется при ховере */}
                    {!isReadOnly && (
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity bg-black/20 z-10"
                          onClick={(e) => {
                              e.stopPropagation(); // Важно: предотвращаем клик по инпуту загрузки
                              logic.setAvatarPreview(null);
                              logic.setAvatarFile(null);
                          }}
                        >
                            <Trash2 size={24} className="text-white hover:text-red-500 drop-shadow-md transition-colors" />
                        </div>
                    )}
                </>
            ) : (
               <>
                    <span className={`text-2xl font-medium text-gray-500 uppercase select-none transition-opacity duration-300 ${!isReadOnly && 'group-hover:opacity-0'}`}>
                        {logic.firstName?.charAt(0) || user.email?.charAt(0)}
                    </span>
                    
                    {!isReadOnly && (
                        <div 
                          className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload size={20} className="text-gray-600" />
                        </div>
                    )}
                </>
            )}

            {/* Затемнение при наведении (подсказка загрузки), если аватара НЕТ */}
            {!isReadOnly && !logic.avatarPreview && (
                <div 
                  className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                  onClick={() => fileInputRef.current?.click()} // Вызов инпута только если нет картинки
                >
                  <Upload size={20} className="text-gray-600" />
                </div>
            )}
        </div>

        {!isReadOnly && (
          <div className="flex flex-col items-start">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-gray-900 font-medium hover:text-red-700 transition-colors"
            >
              <Upload size={18} /> Upload avatar
            </button>
            <span className="text-gray-400 text-xs mt-1">png, jpg or gif no more than 0.5MB</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
        )}
      </div>

      {/* Инфо */}
      <div className="mb-10 text-center">
        <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-1">
          {logic.firstName} {logic.lastName}
        </h2>
        <p className="text-gray-500 text-sm mb-1">{user.email}</p>
        <p className="text-gray-400 text-xs">A member since {formattedDate}</p>
      </div>

      {/* Форма */}
      <div className="w-full max-w-[700px] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-9">
        <FloatingInput
          label="First Name"
          value={logic.firstName}
          onChange={(e) => logic.setFirstName(e.target.value)}
          disabled={isReadOnly}
        />
        <FloatingInput
          label="Last Name"
          value={logic.lastName}
          onChange={(e) => logic.setLastName(e.target.value)}
          disabled={isReadOnly}
        />
        <FloatingSelect
          label="Department"
          value={logic.department}
          onChange={(e) => logic.setDepartment(e.target.value)}
          options={logic.deptData?.departments || []}
          disabled={isReadOnly}
        />
        <FloatingSelect
          label="Position"
          value={logic.position}
          onChange={(e) => logic.setPosition(e.target.value)}
          options={logic.posData?.positions || []}
          disabled={isReadOnly}
        />

        {!isReadOnly && (
          <div className="md:col-start-2">
            <button
              type="button"
              onClick={logic.handleUpdate}
              disabled={!logic.isDirty || logic.isSubmitting}
              className={`w-full font-medium py-3 rounded-full uppercase text-sm tracking-wide transition-all shadow-sm
                ${logic.isDirty && !logic.isSubmitting 
                  ? "bg-[#C8372D] text-white hover:bg-red-800 active:scale-[0.98]" 
                  : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
                }`}
            >
              {logic.isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}