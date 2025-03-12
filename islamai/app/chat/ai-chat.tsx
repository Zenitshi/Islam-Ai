"use client"

import * as React from "react"
import Image from "next/image"
import { User, Bot, MessageSquare, Home, Book, UserIcon, Copy, ThumbsUp, ThumbsDown, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { AIInput } from "@/components/ui/ai-input"
import { type Model } from "@/components/ui/model-selector"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { motion, AnimatePresence } from "framer-motion"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { ConversationHistory } from "@/components/ui/conversation-history"
import { Button } from "@/components/ui/button"
import { AIResponse } from "@/components/ui/ai-response"

interface AIMessage {
  id: string
  content: string
  role: "user" | "assistant"
  model: Model
}

// Mock conversation data
const mockConversations = [
  {
    id: "1",
    title: "Understanding Ramadan",
    summary: "Discussion about the significance of Ramadan, fasting rules, and spiritual benefits",
    scholars: ["Ibn Taymiyyah", "Al-Ghazali"],
    references: ["Sahih Bukhari 1903", "Sahih Muslim 1151"],
    timestamp: new Date()
  },
  // Add more mock conversations as needed
]

const models = [
  { id: "gemini-pro", name: "Gemini 2.0 Pro" },
  { id: "gemini-flash", name: "Gemini 2.0 Flash Thinking" },
  { id: "deepseek-v3", name: "Deepseek V3" },
  { id: "deepseek-r1", name: "Deepseek R1" }
]

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Scholars", url: "/scholars", icon: Book },
  { name: "AI Chat", url: "/chat", icon: MessageSquare },
  { name: "Account", url: "/account", icon: UserIcon },
]

export function AIChat() {
  const [messages, setMessages] = React.useState<AIMessage[]>([])
  const [selectedModel, setSelectedModel] = React.useState<Model>(models[0])
  const [backgroundLoaded, setBackgroundLoaded] = React.useState(false)
  const [activeConversation, setActiveConversation] = React.useState<string>()
  const [isStreaming, setIsStreaming] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (content: string) => {
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      model: selectedModel
    }
    
    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      model: selectedModel
    }
    
    setMessages(prev => [...prev, userMessage, aiMessage])
    setIsStreaming(true)
    
    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          model: selectedModel.id
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data?.response) {
        throw new Error("Invalid response from API");
      }

      setMessages(prev => prev.map(msg => 
        msg.id === aiMessage.id 
          ? { ...msg, content: data.data.response }
          : msg
      ))
    } catch (error) {
      console.error("Error calling AI API:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessage.id 
          ? { ...msg, content: "Sorry, I encountered an error while processing your request. Please try again." }
          : msg
      ))
    } finally {
      setIsStreaming(false)
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleEditMessage = (id: string, content: string) => {
    // TODO: Implement message editing
    console.log("Edit message:", id, content)
  }

  return (
    <main className="flex min-h-screen flex-col relative">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vecteezy_ai-generated-ramadan-wallpaper-islamic-mosque_35380087.jpg-KOMbLPYt3xc59RCGShVX9AcxfB0Fhl.jpeg"
          alt="Islamic Mosque Background"
          fill
          priority
          className={`object-cover transition-opacity duration-1000 ${backgroundLoaded ? "opacity-30" : "opacity-0"}`}
          onLoad={() => setBackgroundLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-islamic-navy/40 via-islamic-navy/60 to-islamic-navy/90" />
      </div>

      {/* Navigation */}
      <NavBar items={navItems} />

      <div className="relative z-10 flex flex-1 pt-16">
        {/* Conversation History */}
        <ConversationHistory
          conversations={mockConversations}
          activeId={activeConversation}
          onSelect={setActiveConversation}
          className="hidden md:block fixed left-0 top-16 bottom-0"
        />

        <div className="flex-1 flex flex-col md:ml-80">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <TextShimmer as="h1" className="text-4xl md:text-6xl font-bold mb-12">
                What do you want to know?
              </TextShimmer>

              <div className="w-full max-w-3xl mb-12">
                <AIInput
                  models={models}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                  onSubmit={handleSubmit}
                />
              </div>

              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <h2 className="text-base font-medium text-white/60 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Example Questions
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <div className="grid gap-3">
                  {["Explain the five pillars of Islam", 
                    "What is the significance of Ramadan?",
                    "How do I perform Salah correctly?"].map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSubmit(question)}
                      className="relative w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all duration-200 ease-in-out text-white/90 hover:text-white hover:border-islamic-cyan/30 hover:shadow-[0_0_15px_rgba(0,200,255,0.1)] group overflow-hidden"
                    >
                      <div className="absolute inset-0 w-full h-full" />
                      <div className="relative flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-islamic-cyan/50 group-hover:text-islamic-cyan transition-colors" />
                        <span>{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                          <div
                            className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${
                              message.role === "user" ? "ml-2 bg-islamic-teal" : "mr-2 bg-islamic-blue"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div
                              className={`glassmorphism p-3 rounded-lg ${
                                message.role === "user"
                                  ? "bg-islamic-teal/10 border border-islamic-teal/20"
                                  : "bg-islamic-blue/10 border border-islamic-blue/20"
                              }`}
                            >
                              {message.role === "assistant" ? (
                                <AIResponse 
                                  content={message.content} 
                                  model={message.model} 
                                  isStreaming={isStreaming && message.id === messages[messages.length - 1].id}
                                />
                              ) : (
                                <div className="text-sm leading-relaxed text-white/90">{message.content}</div>
                              )}
                            </div>

                            {/* Message Actions */}
                            <div className={`flex items-center gap-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div className="group relative">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full hover:bg-white/10"
                                  onClick={() => handleCopyMessage(message.content)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Copy message
                                </div>
                              </div>

                              {message.role === "user" ? (
                                <div className="group relative">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full hover:bg-white/10"
                                    onClick={() => handleEditMessage(message.id, message.content)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Edit message
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="group relative">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full hover:bg-white/10"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      Like response
                                    </div>
                                  </div>
                                  <div className="group relative">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full hover:bg-white/10"
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                      Dislike response
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4">
                <AIInput
                  models={models}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                  onSubmit={handleSubmit}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
