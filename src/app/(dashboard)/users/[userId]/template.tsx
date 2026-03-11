"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isOwnProfile } = useIsOwnProfile()

return (
  isOwnProfile ? (
    <>
        {children}
    </>
  ) : (
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
  )
)
}