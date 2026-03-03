"use client";

import { useRef, useSyncExternalStore } from "react";
import { Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { useUserStore } from "@/store/useUserStore";
import { GET_USER_BY_ID_QUERY } from "./graphql";
import { User } from "@/types/user.types";
import FloatingInput from "@/components/FloatingInput";
import FloatingSelect from "@/components/FloatingSelect";
import { useProfileFormLogic } from "./useProfileForm";
import { GetUserByIdResponse } from "./types";
import Image from "next/image";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ProfileForm() {
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const { user } = useUserStore();
  const params = useParams();
  const profileUserId = params?.userId as string | undefined;

  const isOwnProfile = !!user && (!profileUserId || profileUserId === user.id);

  const { data: profileData } = useQuery<GetUserByIdResponse>(
    GET_USER_BY_ID_QUERY,
    {
      variables: { userId: profileUserId },
      skip: isOwnProfile || !profileUserId || !user,
    }
  );

  if (!isClient || !user) return <div className="p-10 text-center">Loading...</div>;

  const profileUser = isOwnProfile ? user : profileData?.user;
  if (!profileUser) return <div className="p-10 text-center">Loading profile...</div>;

  return <ProfileFormContent key={profileUser.id} user={profileUser} isReadOnly={!isOwnProfile} />;
}

function ProfileFormContent({ user, isReadOnly }: { user: User; isReadOnly: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logic = useProfileFormLogic(user, isReadOnly);

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
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {logic.avatarPreview ? (
                <Image 
                src={logic.avatarPreview} 
                alt="Avatar" 
                fill
                className="object-cover" 
                priority
                unoptimized
                />
            ) : (
                <span className="text-2xl font-medium text-gray-500 uppercase select-none">
                {logic.firstName?.charAt(0) || user.email?.charAt(0)}
                </span>
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
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