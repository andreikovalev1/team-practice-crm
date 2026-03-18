"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, usePathname, useParams } from "next/navigation"
import { ROUTES } from "@/app/configs/routesConfig"

export default function CvLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  // Достаем cvId из URL параметров
  const cvId = params?.cvId as string

  // Определяем активный таб по URL
  const currentTab = pathname?.includes("/skills")
    ? "skills"
    : pathname?.includes("/projects")
    ? "projects"
    : pathname?.includes("/preview")
    ? "preview" : "details"

  function handleChangeTab(value: string) {
    if (value === "details") router.push(ROUTES.CV_DETAILS(cvId))
    if (value === "skills") router.push(ROUTES.CV_SKILLS(cvId))
    if (value === "projects") router.push(ROUTES.CV_PROJECTS(cvId))
    if (value === "preview") router.push(ROUTES.CV_PREVIEW(cvId))
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Здесь позже добавим Breadcrumbs (хлебные крошки) из макета */}
      <Tabs value={currentTab} onValueChange={handleChangeTab} className="mb-6">
        <div>
          <TabsList variant="line" className="bg-transparent h-12 w-full justify-start gap-8">
            <TabsTrigger value="details" className="uppercase font-semibold tracking-wider text-xs">
              Details
            </TabsTrigger>
            <TabsTrigger value="skills" className="uppercase font-semibold tracking-wider text-xs">
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="uppercase font-semibold tracking-wider text-xs">
              Projects
            </TabsTrigger>
            <TabsTrigger value="preview" className="uppercase font-semibold tracking-wider text-xs">
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Отрисовка конкретной страницы (details, skills и т.д.) */}
      <div className="flex-1 w-full max-w-[800px]">
        {children}
      </div>
    </div>
  )
}