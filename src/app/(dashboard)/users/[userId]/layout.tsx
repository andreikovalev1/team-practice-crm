"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/app/configs/routesConfig"
import { useState } from "react";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profileUserId, isOwnProfile } = useIsOwnProfile();
  const [currentTab, setTab] = useState("profile")

  function handleChangeTab(value: string) {
    if(value === "profile") {
        router.push(ROUTES.PROFILE(profileUserId || ""))
        setTab("profile")
    } else if (value === "skills") {
        router.push(ROUTES.SKILLS(profileUserId || ""))
        setTab("skills")
    } else {
        router.push(ROUTES.LANGUAGES(profileUserId || ""))
        setTab("languages")
    }
  }

  return (
    <>
      {!isOwnProfile && 
        <Tabs value={currentTab} onValueChange={(value) => {handleChangeTab(value)}}>
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
        </Tabs>
      } 

      {children}   
    </>
  )
}
