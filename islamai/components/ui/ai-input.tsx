"use client"

import * as React from "react"
import { Globe, Link, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea"
import { ModelSelector, type Model } from "@/components/ui/model-selector"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface AIInputProps {
  onSubmit?: (value: string) => void
  models: Model[]
  selectedModel: Model
  onModelSelect: (model: Model) => void
  className?: string
}

export function AIInput({ onSubmit, models, selectedModel, onModelSelect, className }: AIInputProps) {
  const [value, setValue] = React.useState("")
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 44,
    maxHeight: 200,
  })

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value)
      setValue("")
      adjustHeight(true)
    }
  }

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="relative">
        {/* Main input card */}
        <div className="relative flex flex-col bg-[#1a1c1e]/80 backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-lg">
          {/* Input area */}
          <div className="flex-1 flex items-center min-h-[52px] px-4">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                adjustHeight()
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder="Ask anything..."
              className="flex-1 resize-none border-0 bg-transparent py-[14px] text-[15px] text-white/90 placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-islamic-cyan/30 focus-visible:outline-none"
            />

            {/* Utility buttons */}
            <div className="flex items-center gap-2 ml-2">
              <div className="group relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  tabIndex={-1}
                  className="rounded-xl h-8 w-8 hover:bg-white/5 text-white/40 group-hover:text-white/90 pointer-events-none"
                >
                  <Globe className="h-[18px] w-[18px]" />
                </Button>
                <div className="absolute hidden group-hover:block right-0 top-full mt-2 w-64 p-3 bg-[#1a1c1e]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-xl">
                  <div className="text-sm text-white/70">
                    Search the web for real-time information
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  tabIndex={-1}
                  className="rounded-xl h-8 w-8 hover:bg-white/5 text-white/40 group-hover:text-white/90 pointer-events-none"
                >
                  <Link className="h-[18px] w-[18px]" />
                </Button>
                <div className="absolute hidden group-hover:block right-0 top-full mt-2 w-64 p-3 bg-[#1a1c1e]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-xl">
                  <div className="text-sm text-white/70">
                    Share or save links to reference
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!value.trim()}
                size="icon"
                className={cn(
                  "rounded-xl h-8 w-8",
                  value.trim()
                    ? "bg-islamic-cyan text-white hover:bg-islamic-cyan/90"
                    : "text-white/40 hover:text-white/90 hover:bg-white/5"
                )}
              >
                <Send className="h-[18px] w-[18px]" />
              </Button>
            </div>
          </div>

          {/* Model selector below */}
          <div className="px-4 py-2 border-t border-white/[0.08]">
            <ModelSelector
              models={[
                { id: "gemini-pro", name: "Gemini 2.0 Pro" },
                { id: "gemini-flash", name: "Gemini 2.0 Flash Thinking" },
                { id: "deepseek-v3", name: "Deepseek V3" },
                { id: "deepseek-r1", name: "Deepseek R1" }
              ]}
              selectedModel={selectedModel}
              onModelSelect={onModelSelect}
              className="h-8 px-2 text-sm bg-transparent hover:bg-white/5 rounded-lg transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

