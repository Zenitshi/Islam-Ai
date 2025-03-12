"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Sparkles } from "lucide-react"
import { Button } from "./button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { Components } from "react-markdown"
import { Typewriter } from "./typewriter"

interface AIResponseProps {
  content: string
  model: {
    id: string
    name: string
  }
  className?: string
  isStreaming?: boolean
}

interface MarkdownProps {
  children?: React.ReactNode
  [key: string]: any
}

export function AIResponse({ content, model, className, isStreaming = false }: AIResponseProps) {
  const isThinkingModel = model.id.includes("flash") || model.id.includes("reasoner")
  const [showThoughtProcess, setShowThoughtProcess] = React.useState(isThinkingModel)
  const [formattedContent, setFormattedContent] = React.useState("")
  const [thoughtProcess, setThoughtProcess] = React.useState("")
  const [isThinking, setIsThinking] = React.useState(isStreaming)
  const [streamedText, setStreamedText] = React.useState("")

  React.useEffect(() => {
    if (isThinkingModel) {
      const parts = content.split("---")
      if (parts.length > 1) {
        setThoughtProcess(parts[0].trim())
        setFormattedContent(parts[1].trim())
      } else {
        setFormattedContent(content)
      }
    } else {
      setFormattedContent(content)
    }
    
    if (!isStreaming) {
      setIsThinking(false)
      setStreamedText(content)
    }
  }, [content, isThinkingModel, isStreaming])

  const MarkdownComponents: Components = {
    h1: ({ children, ...props }: MarkdownProps) => {
      if (typeof children === 'string' && children.includes('THOUGHT PROCESS')) {
        return (
          <h1 className="text-islamic-cyan font-bold text-xl mb-6" {...props}>
            1. THOUGHT PROCESS:
          </h1>
        )
      }
      return <h1 className="text-islamic-cyan font-semibold text-2xl mt-6 mb-4" {...props}>{children}</h1>
    },
    h2: ({ children, ...props }: MarkdownProps) => <h2 className="text-islamic-cyan font-semibold text-xl mt-5 mb-3" {...props}>{children}</h2>,
    h3: ({ children, ...props }: MarkdownProps) => <h3 className="text-islamic-cyan font-semibold text-lg mt-4 mb-2" {...props}>{children}</h3>,
    strong: ({ children, ...props }: MarkdownProps) => <strong className="text-white/90 font-semibold" {...props}>{children}</strong>,
    em: ({ children, ...props }: MarkdownProps) => <em className="text-islamic-cyan italic" {...props}>{children}</em>,
    ul: ({ children, ...props }: MarkdownProps) => <ul className="space-y-1 my-3" {...props}>{children}</ul>,
    ol: ({ children, ...props }: MarkdownProps) => <ol className="space-y-1 list-decimal pl-4 my-3" {...props}>{children}</ol>,
    li: ({ children, ...props }: MarkdownProps) => {
      const text = React.Children.toArray(children).join('')
      if (text.startsWith('Thinking ')) {
        const [thinking, ...rest] = text.split(':')
        const number = thinking.match(/\d+/)?.[0] || ''
        return (
          <div className="relative pl-8 py-2 ml-2 mb-4" {...props}>
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-islamic-cyan/20" />
            {/* Step dot */}
            <div className="absolute left-[-3px] top-4 w-[7px] h-[7px] rounded-full bg-islamic-cyan" />
            {/* Thinking header */}
            <div className="text-islamic-cyan font-bold mb-2">{thinking}:</div>
            {/* Content */}
            <div className="text-white/80">{rest.join(':')}</div>
            {/* Bottom border */}
            <div className="absolute left-8 right-0 bottom-0 h-px bg-islamic-cyan/10" />
          </div>
        )
      }
      return (
        <li className="flex gap-2 items-start my-1" {...props}>
          <span className="text-islamic-cyan mt-1">•</span>
          <span className="flex-1">{children}</span>
        </li>
      )
    },
    table: ({ children, ...props }: MarkdownProps) => (
      <div className="my-4 w-full overflow-x-auto">
        <table className="w-full border-collapse" {...props}>{children}</table>
      </div>
    ),
    thead: ({ children, ...props }: MarkdownProps) => <thead className="bg-islamic-cyan/10" {...props}>{children}</thead>,
    th: ({ children, ...props }: MarkdownProps) => (
      <th className="border border-islamic-cyan/20 p-2 text-islamic-cyan font-semibold" {...props}>{children}</th>
    ),
    td: ({ children, ...props }: MarkdownProps) => (
      <td className="border border-islamic-cyan/20 p-2" {...props}>{children}</td>
    ),
    code: ({ inline, children, ...props }: MarkdownProps & { inline?: boolean }) => 
      inline ? (
        <code className="px-1 py-0.5 rounded bg-islamic-cyan/10 text-islamic-cyan font-mono text-sm" {...props}>{children}</code>
      ) : (
        <code className="block p-4 rounded-lg bg-islamic-cyan/5 border border-islamic-cyan/20 font-mono text-sm overflow-x-auto" {...props}>{children}</code>
      ),
    blockquote: ({ children, ...props }: MarkdownProps) => (
      <blockquote className="border-l-4 border-islamic-cyan/30 pl-4 my-4 italic text-white/80" {...props}>{children}</blockquote>
    ),
    a: ({ children, ...props }: MarkdownProps) => (
      <a className="text-islamic-cyan hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
    ),
    p: ({ children, ...props }: MarkdownProps) => {
      if (typeof children === 'string') {
        const parts = children.split('*')
        if (parts.length > 1) {
          return (
            <p className="my-2 leading-relaxed" {...props}>
              {parts.map((part, i) => (
                i % 2 === 0 ? part : <span key={i} className="text-islamic-cyan">{part}</span>
              ))}
            </p>
          )
        }
      }
      return <p className="my-2 leading-relaxed" {...props}>{children}</p>
    },
    hr: (props: MarkdownProps) => <hr className="my-6 border-islamic-cyan/20" {...props} />
  }

  return (
    <div className={cn("relative space-y-3", className)}>
      <AnimatePresence>
        {(isThinkingModel && isThinking) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 text-islamic-cyan mb-2"
          >
            {model.id.includes("reasoner") ? (
              <>
                <Brain className="w-5 h-5 animate-pulse" />
                <span className="text-sm">Deep thinking in progress...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm">Quick thinking in progress...</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time thought process display */}
      {isThinkingModel && isThinking && thoughtProcess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 rounded-lg bg-islamic-cyan/5 border border-islamic-cyan/10 text-sm leading-relaxed text-white/80"
        >
          <Typewriter
            text={thoughtProcess}
            speed={30}
            cursor="|"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm leading-relaxed text-white/90"
      >
        {isStreaming ? (
          <Typewriter
            text={formattedContent}
            speed={30}
            cursor="|"
          />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={MarkdownComponents}
          >
            {formattedContent}
          </ReactMarkdown>
        )}
      </motion.div>

      {isThinkingModel && !isThinking && thoughtProcess && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-islamic-cyan/70 hover:text-islamic-cyan"
            onClick={() => setShowThoughtProcess(!showThoughtProcess)}
          >
            {showThoughtProcess ? (
              <>
                <Brain className="w-4 h-4" />
                Hide Thinking Process
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Show Thinking Process
              </>
            )}
          </Button>

          {showThoughtProcess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-lg bg-islamic-cyan/5 border border-islamic-cyan/10 text-sm leading-relaxed text-white/80"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={MarkdownComponents}
              >
                {thoughtProcess}
              </ReactMarkdown>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
} 