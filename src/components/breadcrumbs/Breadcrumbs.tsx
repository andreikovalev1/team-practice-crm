"use client"

import { usePathname } from "next/navigation"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { GetUserByIdResponse } from "@/features/profile/types";
import { GET_USER_BY_ID_QUERY } from "@/features/profile/graphql";
import { useQuery } from "@apollo/client/react";

export default function Breadcrumbs() {

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

      const rootLabel =
        pathname.includes("skills")
          ? "Skills"
          : pathname.includes("languages")
          ? "Languages"
          : pathname.includes("cvs")
          ? "CVs"
          : "Employees"

      const isSubPage = pathname.includes("skills")
       || pathname.includes("languages")
       || pathname.includes("cvs")

      const breadcrumbs = [
        {
          label: rootLabel,
        },
      ]

      if (!isSubPage && profileUserId && fullName) {
        breadcrumbs.push({
          label: fullName,
        })
      }

    return (
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
    )
}