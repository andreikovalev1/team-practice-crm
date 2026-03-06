"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from "next/navigation"
import { ROUTES } from "@/app/configs/routesConfig"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { profileUserId, isOwnProfile } = useIsOwnProfile()

  const currentTab = pathname?.includes("/skills")
    ? "skills"
    : pathname?.includes("/languages")
    ? "languages"
    : "profile"

  function handleChangeTab(value: string) {
    if (value === "profile") {
      router.push(ROUTES.PROFILE(profileUserId || ""))
    }

    if (value === "skills") {
      router.push(ROUTES.SKILLS(profileUserId || ""))
    }

    if (value === "languages") {
      router.push(ROUTES.LANGUAGES(profileUserId || ""))
    }
  }

  return (
    <>
      {!isOwnProfile && (
        <Tabs value={currentTab} onValueChange={handleChangeTab}>
          <div>
            <TabsList variant="line">
              <TabsTrigger value="profile" className="uppercase">
                Profile
              </TabsTrigger>

              <TabsTrigger value="skills" className="uppercase">
                Skills
              </TabsTrigger>

              <TabsTrigger value="languages" className="uppercase">
                Languages
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      )}

      {children}
    </>
  )
}