"use client"
import { useState, useRef, useCallback, useEffect } from "react"

interface UseAutoResizeTextareaOptions {
  minHeight?: number
  maxHeight?: number
}

export function useAutoResizeTextarea({ minHeight = 48, maxHeight = 164 }: UseAutoResizeTextareaOptions = {}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [height, setHeight] = useState(minHeight)

  const adjustHeight = useCallback(
    (force = false) => {
      if (!textareaRef.current) return

      const { scrollHeight } = textareaRef.current
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)

      if (force || newHeight !== height) {
        setHeight(newHeight)
      }
    },
    [height, minHeight, maxHeight],
  )

  useEffect(() => {
    adjustHeight(true)
  }, [adjustHeight])

  useEffect(() => {
    const handleResize = () => {
      adjustHeight()
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}

