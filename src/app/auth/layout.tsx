"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "next/navigation"
import { ROUTES } from "@/app/configs/routesConfig"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const currentTab = pathname === ROUTES.LOGIN ? "login" : "register"
  const isReset = pathname === ROUTES.RESET
  const isNewPassword = pathname === ROUTES.NEWPASSWORD

  return (
    <div className="min-h-screen flex flex-col">

      {!isReset && !isNewPassword && (
        <div className="flex justify-center pt-6">
          <Tabs value={currentTab} onValueChange={(value) => {
              router.push(
                value === "login"
                  ? ROUTES.LOGIN
                  : ROUTES.REGISTER
              )
            }}
          >
            <TabsList variant="line">
              <TabsTrigger value="login" className="uppercase cursor-pointer">
                Log in
              </TabsTrigger>

              <TabsTrigger value="register" className="uppercase cursor-pointer">
                Sign up
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>

    </div>
  )
}