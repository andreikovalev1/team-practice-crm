"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname } from "next/navigation"
import { ROUTES } from "@/app/configs/routesConfig"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { profileUserId } = useIsOwnProfile()

  const currentTab = pathname?.includes("/skills")
    ? "skills"
    : pathname?.includes("/languages")
    ? "languages"
    : pathname?.includes("/profile")
    ? "profile" : "cvs"

  function handleChangeTab(value: string) {
    if (value === "profile") {
      router.push(ROUTES.PROFILE(profileUserId || ""))
    }

    if (value === "skills") {
      router.push(ROUTES.USERSKILLS(profileUserId || ""))
    }

    if (value === "languages") {
      router.push(ROUTES.USERLANGUAGES(profileUserId || ""))
    }

    if (value === "cvs") {
      router.push(ROUTES.USERCVS(profileUserId || ""))
    }
  }

  return (
    <>
        <Tabs value={currentTab} onValueChange={handleChangeTab}>
          <div className="px-4">
            <TabsList variant="line">
              <TabsTrigger value="profile" className="uppercase cursor-pointer">
                Profile
              </TabsTrigger>

              <TabsTrigger value="skills" className="uppercase cursor-pointer">
                Skills
              </TabsTrigger>

              <TabsTrigger value="languages" className="uppercase cursor-pointer">
                Languages
              </TabsTrigger>

              <TabsTrigger value="cvs" className="uppercase cursor-pointer">
                CVs
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

      {children}
    </>
  )
}