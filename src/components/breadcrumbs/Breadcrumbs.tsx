"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile"
import { GetUserByIdResponse } from "@/features/profile/types"
import { GET_USER_BY_ID_QUERY } from "@/features/profile/graphql"
import { useQuery } from "@apollo/client/react"
import { ROUTES } from "@/app/configs/routesConfig"

export default function Breadcrumbs() {

  const pathname = usePathname()

  const { user, profileUserId, isOwnProfile } = useIsOwnProfile()

  const { data: profileData } = useQuery<GetUserByIdResponse>(
    GET_USER_BY_ID_QUERY,
    {
      variables: { userId: profileUserId },
      skip: isOwnProfile || !profileUserId || !user,
    }
  )

  const profileUser = isOwnProfile ? user : profileData?.user

  const fullName = `${profileUser?.profile?.first_name ?? ""} ${profileUser?.profile?.last_name ?? ""}`.trim()

  const breadcrumbs: { label: string; href?: string }[] = []

  if (pathname === ROUTES.HOME) {
    breadcrumbs.push({ label: "Employees" })
  }

  if (pathname === ROUTES.SKILLS) {
    breadcrumbs.push({ label: "Skills" })
  }

  if (pathname === ROUTES.LANGUAGES) {
    breadcrumbs.push({ label: "Languages" })
  }

  if (pathname === ROUTES.CVS) {
    breadcrumbs.push({ label: "CVs" })
  }

  if (pathname.startsWith("/users") && profileUserId) {
    breadcrumbs.push({
      label: "Employees",
      href: ROUTES.HOME,
    })

    if (fullName) {
      breadcrumbs.push({
        label: fullName,
        href: ROUTES.PROFILE(profileUserId),
      })
    }

    if (pathname.includes("/skills")) {
      breadcrumbs.push({
        label: "Skills",
      })
    }

    if (pathname.includes("/languages")) {
      breadcrumbs.push({
        label: "Languages",
      })
    }

    if (pathname.includes("/cvs")) {
      breadcrumbs.push({
        label: "CVs",
      })
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">

    {breadcrumbs.map((crumb, index) => {
      const isProfileName = crumb.label === fullName

      return (
        <div key={crumb.label} className="flex items-center gap-2">

          {index > 0 && <span>{">"}</span>}

          {crumb.href ? (
            <Link
              href={crumb.href}
              className={
                isProfileName
                  ? "text-red-700"
                  : "text-gray-500 hover:text-red-700 transition-colors"
              }
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={isProfileName ? "text-red-700" : "text-gray-500"}>
              {crumb.label}
            </span>
          )}

        </div>
      )
    })}
    </div>
  )
}