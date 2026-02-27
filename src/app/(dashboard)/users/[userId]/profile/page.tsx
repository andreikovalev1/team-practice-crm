"use client"
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import OvalButton from "@/components/button/OvalButton";

export default function Profile() {
  const { user } = useUserStore();

  const firstName = user?.profile?.first_name || "User";
  const lastName = user?.profile?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return (
<div className="flex items-center justify-center w-full px-4">
      {user?.profile?.avatar ? (
        <img
          src={user.profile.avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
          {user?.profile?.first_name
            ? user?.profile.first_name.charAt(0).toUpperCase()
            : user?.email.charAt(0).toUpperCase()}
        </div>
      )}

        <form className="flex flex-col items-center w-full max-w-140">
              <Input 
                  placeholder="Email" 
                  type="email"
                  required
                  className="rounded-none border border-gray-300 mb-5" 
                />

                <Input 
                  type="password" 
                  placeholder={user?.department_name}
                  required
                  className="rounded-none border border-gray-300 mb-10" 
                />
              
              <div className="mb-5">
                <OvalButton text={`lflfl`} />
              </div>


        </form>
      </div>
  )
}