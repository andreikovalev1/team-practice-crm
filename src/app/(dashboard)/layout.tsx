"use client"

import { usePathname } from "next/navigation"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { GetUserByIdResponse } from "@/features/profile/types";
import { GET_USER_BY_ID_QUERY } from "@/features/profile/graphql";
import { useQuery } from "@apollo/client/react";

import Sidebar from "@/features/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()
  const { user, profileUserId, isOwnProfile } = useIsOwnProfile();

  const { data: profileData } = useQuery<GetUserByIdResponse>(
    GET_USER_BY_ID_QUERY,
    {
      variables: { userId: profileUserId },
      skip: isOwnProfile || !profileUserId || !user,
    }
  );

  const profileUser = isOwnProfile ? user : profileData?.user;
  const firstName = profileUser?.profile?.first_name || ""
  const lastName = profileUser?.profile?.last_name || ""
  const fullName = `${firstName} ${lastName}`.trim()

  const breadcrumbs = [
    {
      label: "Employees",
    },
  ]

  if (profileUserId && fullName) {
    breadcrumbs.push({
      label: fullName,
    })
  }

  if (pathname.includes("skills")) {
    breadcrumbs.push({
      label: "Skills",
    })
  }

  if (pathname.includes("languages")) {
    breadcrumbs.push({
      label: "Languages",
    })
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black pb-16 md:pb-0">
      <Sidebar />
      <main className="flex-1 w-full overflow-y-auto">

        <div className="px-6 pt-4 pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => {
              const isProfileName = crumb.label === fullName

              return (
                <div key={crumb.label} className="flex items-center gap-2">
                  {index > 0 && <span>{">"}</span>}

                  <span
                    className={`transition-colors ${
                        isProfileName
                          ? "text-red-700"
                          : "text-gray-500"
                      }`}
                  >
                    {crumb.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}