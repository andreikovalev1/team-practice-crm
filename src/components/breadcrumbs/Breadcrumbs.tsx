"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useQuery } from "@apollo/client/react"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile"
import { GET_USER_BY_ID_QUERY } from "@/features/profile/graphql"
import { GET_CV_BY_ID_QUERY } from "@/features/cvs/graphql"
import { ROUTES } from "@/app/configs/routesConfig"
import { GetUserByIdResponse } from "@/features/profile/types"
import { GetCvByIdResponse } from "@/features/cvs/types"

type Crumb = {
  label: string
  href?: string
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  const params = useParams()

  const cvId = params?.cvId as string

  const { user, profileUserId, isOwnProfile } = useIsOwnProfile()

  const { data: profileData } = useQuery<GetUserByIdResponse>(
    GET_USER_BY_ID_QUERY,
    {
      variables: { userId: profileUserId },
      skip: isOwnProfile || !profileUserId || !user,
    }
  )

  const { data: cvData } = useQuery<GetCvByIdResponse>(
    GET_CV_BY_ID_QUERY,
    {
      variables: { cvId },
      skip: !cvId,
    }
  )

  const profileUser = isOwnProfile ? user : profileData?.user
  const fullName = `${profileUser?.profile?.first_name ?? ""} ${profileUser?.profile?.last_name ?? ""}`.trim()

  const cv = cvData?.cv
  const cvOwner = cv?.user
  const cvOwnerName = `${cvOwner?.profile?.first_name ?? ""} ${cvOwner?.profile?.last_name ?? ""}`.trim()

  const breadcrumbs: Crumb[] = []

  const staticRoutes: Record<string, string> = {
    [ROUTES.HOME]: "Employees",
    [ROUTES.SKILLS]: "Skills",
    [ROUTES.LANGUAGES]: "Languages",
    [ROUTES.SETTINGS]: "Settings",
    [ROUTES.CVS]: "CVs",
    [ROUTES.PROJECTS]: "Projects",
    [ROUTES.DEPARTMENTS]: "Departments",
    [ROUTES.POSITIONS]: "Positions",
  }

  if (staticRoutes[pathname]) {
    breadcrumbs.push({ label: staticRoutes[pathname] })
  }

  if (pathname.startsWith("/users") && profileUserId) {
    breadcrumbs.push({ label: "Employees", href: ROUTES.HOME })

    if (fullName) {
      breadcrumbs.push({
        label: fullName,
        href: ROUTES.PROFILE(profileUserId),
      })
    }

    if (pathname.includes("/skills")) {
      breadcrumbs.push({ label: "Skills" })
    }

    if (pathname.includes("/languages")) {
      breadcrumbs.push({ label: "Languages" })
    }

    if (pathname.includes("/cvs")) {
      breadcrumbs.push({ label: "CVs" })
    }
  }

  if (pathname.startsWith("/cvs") && cvId && pathname !== ROUTES.CVS) {
    if (cvOwner) {
      breadcrumbs.push({ label: "Employees", href: ROUTES.HOME })

      breadcrumbs.push({
        label: cvOwnerName || "User",
        href: ROUTES.PROFILE(cvOwner.id),
      })

      breadcrumbs.push({
        label: "CVs",
        href: ROUTES.USERCVS(cvOwner.id),
      })
    } else {
      breadcrumbs.push({ label: "CVs", href: ROUTES.CVS })
    }

    const cvTabsMap: Record<string, string> = {
      details: "Details",
      skills: "Skills",
      projects: "Projects",
      preview: "Preview",
    }

    const currentTab = Object.keys(cvTabsMap).find((tab) =>
      pathname.includes(`/${tab}`)
    )

    const cvTabLabel = currentTab
      ? cvTabsMap[currentTab]
      : "Details"

    breadcrumbs.push({ label: cvTabLabel })
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#ECECED] md:text-base">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        const isHighlighted =
          crumb.label === fullName ||
          crumb.label === cvOwnerName ||
          isLast

        return (
          <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span>{">"}</span>}

            {crumb.href ? (
              <Link
                href={crumb.href}
                className={
                  isHighlighted
                    ? "text-red-700"
                    : "hover:text-red-700 transition-colors"
                }
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={isHighlighted ? "text-red-700" : ""}>
                {crumb.label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}