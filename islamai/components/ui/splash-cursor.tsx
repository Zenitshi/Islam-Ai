"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface SplashCursorProps {
  color?: string
  size?: number
  duration?: number
  children: React.ReactNode
  className?: string
}

export const SplashCursor: React.FC<SplashCursorProps> = ({
  color = "#22d3ee",
  size = 15,
  duration = 1000,
  children,
  className,
}) => {
  const cursor = useRef<HTMLDivElement>(null)
  const cursorSize = useMotionValue(size)
  const springSize = useSpring(cursorSize, { duration: duration })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursor.current) {
        cursor.current.style.top = `${e.clientY - size / 2}px`
        cursor.current.style.left = `${e.clientX - size / 2}px`
      }
    }

    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
    }
  }, [size])

  return (
    <div className={className}>
      {children}
      <motion.div
        ref={cursor}
        className="fixed pointer-events-none z-50 rounded-full mix-blend-difference"
        style={{
          width: springSize,
          height: springSize,
          backgroundColor: color,
        }}
        animate={{ scale: [1, 2, 1] }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

