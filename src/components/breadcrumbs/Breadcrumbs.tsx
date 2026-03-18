"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile"
import { GetUserByIdResponse } from "@/features/profile/types"
import { GET_USER_BY_ID_QUERY } from "@/features/profile/graphql"
import { GET_CV_BY_ID_QUERY } from "@/features/cvs/graphql"
import { useQuery } from "@apollo/client/react"
import { ROUTES } from "@/app/configs/routesConfig"
import { GetCvByIdResponse } from "@/features/cvs/types"

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
  const { data: cvData } = useQuery<GetCvByIdResponse>(GET_CV_BY_ID_QUERY, {
    variables: { cvId },
    skip: !cvId,
  })

  const cv = cvData?.cv
  const cvOwner = cv?.user
  const cvOwnerName = `${cvOwner?.profile?.first_name ?? ""} ${cvOwner?.profile?.last_name ?? ""}`.trim()
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

  if (pathname.startsWith("/cvs") && cvId && pathname !== ROUTES.CVS) {
    if (cvOwner) {
      // Если у CV есть владелец, строим путь через него (как на твоем скрине)
      breadcrumbs.push({ label: "Employees", href: ROUTES.HOME });
      breadcrumbs.push({ 
        label: cvOwnerName || "User", 
        href: ROUTES.PROFILE(cvOwner.id) 
      });
      breadcrumbs.push({ 
        label: "CVs", 
        href: `/users/${cvOwner.id}/cvs` // Путь к списку всех CV этого пользователя
      });
    } else {
      // Если данных о владельце нет, просто показываем общую папку
      breadcrumbs.push({ label: "CVs", href: ROUTES.CVS });
    }

    // Добавляем имя самого CV (делаем его красным, так как это конечная точка)
    breadcrumbs.push({ label: cv?.name || "Loading..." });
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">

    {breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const isRed = 
        crumb.label === fullName || 
        crumb.label === cvOwnerName || 
        isLast;

      return (
        <div key={crumb.label} className="flex items-center gap-2">

          {index > 0 && <span>{">"}</span>}

          {crumb.href ? (
            <Link
              href={crumb.href}
              className={
                isRed
                  ? "text-red-700"
                  : "text-gray-500 hover:text-red-700 transition-colors"
              }
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={isRed ? "text-red-700" : "text-gray-500"}>
              {crumb.label}
            </span>
          )}

        </div>
      )
    })}
    </div>
  )
}