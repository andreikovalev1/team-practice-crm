"use client";

import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import OvalButton from "@/components/button/OvalButton";

export default function Profile() {
  const { user } = useUserStore();

  const firstName = user?.profile?.first_name || "User";
  const lastName = user?.profile?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
const formattedDate = user?.created_at
  ? new Date(Number(user.created_at)).toDateString()
  : null;

  return (
    <div className="flex justify-center w-full px-6 py-10">
      
      <div className="w-full max-w-3xl">

        <div className="flex flex-col items-center mb-10">

          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-600 overflow-hidden">
            {user?.profile?.avatar ? (
              <img
                src={user.profile.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.profile?.first_name?.charAt(0).toUpperCase() ||
              user?.email?.charAt(0).toUpperCase()
            )}
          </div>

          <h2 className="mt-4 text-xl font-medium">
            {fullName}
          </h2>

          <p className="text-gray-500 text-sm">
            {user?.email}
          </p>

          <p className="text-gray-400 text-sm mt-1">
            A member since{" "}
            {formattedDate}
          </p>
        </div>

        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Input
            placeholder="First Name"
            defaultValue={user?.profile?.first_name}
            className="rounded-none border border-gray-300"
          />

          <Input
            placeholder="Last Name"
            defaultValue={user?.profile?.last_name}
            className="rounded-none border border-gray-300"
          />

          <Input
            placeholder="Department"
            defaultValue={user?.department_name}
            className="rounded-none border border-gray-300"
          />

          <Input
            placeholder="Position"
            defaultValue={user?.position_name}
            className="rounded-none border border-gray-300"
          />

          <div className="md:col-span-2 flex justify-center mt-6">
            <OvalButton text="Update" />
          </div>

        </form>

      </div>
    </div>
  );
}