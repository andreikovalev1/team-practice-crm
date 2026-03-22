"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname, useParams } from "next/navigation"
import { ROUTES } from "@/app/configs/routesConfig"
import { motion, AnimatePresence } from "framer-motion"

export default function CvLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const cvId = params?.cvId as string

  const currentTab = pathname?.includes("/skills")
    ? "skills"
    : pathname?.includes("/projects")
    ? "projects"
    : pathname?.includes("/preview")
    ? "preview" : "details"

  return (
    <>
      <Tabs value={currentTab} onValueChange={(v) => {
        if (v === "details") router.push(ROUTES.CV_DETAILS(cvId))
        if (v === "skills") router.push(ROUTES.CV_SKILLS(cvId))
        if (v === "projects") router.push(ROUTES.CV_PROJECTS(cvId))
        if (v === "preview") router.push(ROUTES.CV_PREVIEW(cvId))
      }} className="mb-6">
        <div className="px-4">
          <TabsList variant="line" className="bg-transparent h-12 w-full justify-start">
            <TabsTrigger value="details" className="uppercase cursor-pointer">Details</TabsTrigger>
            <TabsTrigger value="skills" className="uppercase cursor-pointer">Skills</TabsTrigger>
            <TabsTrigger value="projects" className="uppercase cursor-pointer">Projects</TabsTrigger>
            <TabsTrigger value="preview" className="uppercase cursor-pointer">Preview</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div className="flex-1 w-full"> 
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}