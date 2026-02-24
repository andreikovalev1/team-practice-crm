"use client"

import AuthForm from "./AuthForm"
import { useAuthModeStore } from "@/store/useAuthModeStore"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function Layout() {
  const { mode, setMode } = useAuthModeStore()

  return (
    <div className="min-h-screen flex flex-col">
      
      { mode !== "reset" 
        && 
        <div className="flex justify-center pt-6">
            <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "login" | "register")}
            >
            <TabsList variant="line">
                <TabsTrigger value="login">ВОЙТИ</TabsTrigger>
                <TabsTrigger value="register">СОЗДАТЬ</TabsTrigger>
            </TabsList>
            </Tabs>
        </div>
      }

      <div className="flex-1 flex items-center justify-center">
        <AuthForm />
      </div>

    </div>
  )
}