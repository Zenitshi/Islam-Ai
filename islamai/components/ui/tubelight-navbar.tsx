"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className={cn("fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-30 mb-6 sm:pt-6 pointer-events-none", className)}>
      <div className="flex items-center gap-3 glassmorphism py-1 px-1 rounded-full shadow-lg pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.url

          return (
            <Link
              key={item.name}
              href={item.url}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-foreground/80 hover:text-islamic-cyan",
                isActive && "bg-muted text-islamic-cyan",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-islamic-cyan/5 rounded-full -z-10 pointer-events-none"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-islamic-cyan rounded-t-full pointer-events-none">
                    <div className="absolute w-12 h-6 bg-islamic-cyan/20 rounded-full blur-md -top-2 -left-2 pointer-events-none" />
                    <div className="absolute w-8 h-6 bg-islamic-cyan/20 rounded-full blur-md -top-1 pointer-events-none" />
                    <div className="absolute w-4 h-4 bg-islamic-cyan/20 rounded-full blur-sm top-0 left-2 pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

