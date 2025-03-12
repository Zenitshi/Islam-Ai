"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface CustomScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CustomScrollbar({ children, className, ...props }: CustomScrollbarProps) {
  return (
    <div
      className={cn(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-islamic-cyan/20 hover:scrollbar-thumb-islamic-cyan/30",
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

