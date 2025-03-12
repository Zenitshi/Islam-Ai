"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 auto-rows-[20rem] gap-4 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  size = "default",
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  size?: "small" | "default" | "wide" | "tall" | "large"
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Define size classes based on the size prop
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    default: "col-span-1 row-span-1",
    wide: "col-span-2 row-span-1",
    tall: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3, delay: 0.1 }}
      variants={variants}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-xl glassmorphism",
        sizeClasses[size],
        className,
      )}
    >
      {header && <div className="z-10">{header}</div>}

      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-2">
        {icon && (
          <div className="h-12 w-12 origin-left transform-gpu text-islamic-cyan transition-all duration-300 ease-in-out group-hover:scale-75">
            {icon}
          </div>
        )}
        {title && <h3 className="text-xl font-semibold text-foreground">{title}</h3>}
        {description && <div className="max-w-lg text-muted-foreground">{description}</div>}
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

