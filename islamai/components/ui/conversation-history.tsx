"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MessageSquare, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  title: string
  summary: string
  scholars: string[]
  references: string[]
  timestamp: Date
}

interface ConversationHistoryProps {
  conversations: Conversation[]
  activeId?: string
  onSelect: (id: string) => void
  className?: string
}

export function ConversationHistory({ conversations, activeId, onSelect, className }: ConversationHistoryProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const tooltipTimer = React.useRef<NodeJS.Timeout>()

  const handleMouseEnter = (id: string) => {
    setHoveredId(id)
    tooltipTimer.current = setTimeout(() => {
      setShowTooltip(true)
    }, 2000) // 2 second delay
  }

  const handleMouseLeave = () => {
    setHoveredId(null)
    setShowTooltip(false)
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current)
    }
  }

  return (
    <div className={cn(
      "w-80 h-[calc(100vh-4rem)] bg-white/5 backdrop-blur-xl border-r border-white/10",
      "flex flex-col rounded-tr-[2rem] rounded-br-[2rem] overflow-hidden",
      className
    )}>
      <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/5">
        <Clock className="w-4 h-4 text-white" />
        <h2 className="text-sm font-medium text-white/90">Conversation History</h2>
      </div>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-none">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(conv.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => onSelect(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
                "hover:bg-white/5 group backdrop-blur-sm",
                activeId === conv.id ? "bg-white/10 text-islamic-cyan border border-islamic-cyan/20" : "text-white/70"
              )}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">{conv.title}</span>
            </button>

            {hoveredId === conv.id && showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed left-80 ml-2 top-1/2 -translate-y-1/2 z-50 w-72 p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
              >
                <h3 className="text-sm font-medium text-white/90 mb-2">{conv.title}</h3>
                <p className="text-xs text-white/70 mb-3">{conv.summary}</p>
                
                {conv.scholars.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-xs font-medium text-white/50 mb-1">Scholars Referenced</h4>
                    <div className="flex flex-wrap gap-1">
                      {conv.scholars.map((scholar) => (
                        <span
                          key={scholar}
                          className="px-2 py-0.5 text-xs rounded-full bg-islamic-cyan/10 text-islamic-cyan"
                        >
                          {scholar}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {conv.references.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-white/50 mb-1">References</h4>
                    <div className="text-xs text-white/70 space-y-1">
                      {conv.references.map((ref) => (
                        <div key={ref} className="truncate">{ref}</div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

