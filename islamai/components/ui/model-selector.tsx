"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Model {
  id: string
  name: string
  description?: string
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: Model
  onModelSelect: (model: Model) => void
  className?: string
}

export function ModelSelector({ models, selectedModel, onModelSelect, className }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={className}
        >
          <span className="text-islamic-cyan">{selectedModel.name}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-islamic-cyan/70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[200px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl animate-in fade-in-0 zoom-in-95"
      >
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelSelect(model)}
            className={`px-3 py-2.5 text-sm cursor-pointer transition-colors hover:bg-white/10 hover:text-islamic-cyan focus:bg-white/10 focus:text-islamic-cyan ${
              model.id === selectedModel.id ? "text-islamic-cyan bg-white/5" : "text-white/70"
            }`}
          >
            {model.name}
            {model.description && <span className="text-xs text-muted-foreground">{model.description}</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

