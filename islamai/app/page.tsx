"use client"

import { useState } from "react"
import Image from "next/image"
import { Home, Book, MessageSquare, User, Moon, Sun, BookOpen, Volume2, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Button } from "@/components/ui/neon-button"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { SparklesCore } from "@/components/ui/sparkles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
  const { setTheme, theme } = useTheme()
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Scholars", url: "/scholars", icon: Book },
    { name: "AI Chat", url: "/chat", icon: MessageSquare },
    { name: "Account", url: "/account", icon: User },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vecteezy_ai-generated-ramadan-wallpaper-islamic-mosque_35380087.jpg-KOMbLPYt3xc59RCGShVX9AcxfB0Fhl.jpeg"
          alt="Islamic Mosque Background"
          fill
          priority
          className={`object-cover transition-opacity duration-1000 ${backgroundLoaded ? "opacity-60" : "opacity-0"}`}
          onLoad={() => setBackgroundLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-islamic-navy/40 via-islamic-navy/60 to-islamic-navy/90" />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 z-50 p-2 rounded-full glassmorphism"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Navigation */}
      <NavBar items={navItems} />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4 py-12 text-center">
        <div className="animate-float">
          <Avatar className="w-24 h-24 mb-6 mx-auto">
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_islam-dZoMpBTWvkdL6CGcZKJaqwRjft5gCF.png"
              alt="Islamic Scholar AI Logo"
            />
            <AvatarFallback className="bg-islamic-cyan/20">ISA</AvatarFallback>
          </Avatar>
          <TextShimmer as="h1" className="text-4xl md:text-6xl font-bold mb-4 font-arabic">
            Islamic Scholar AI
          </TextShimmer>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <TextGenerateEffect
            words="Explore the wisdom of Islamic scholars through the power of artificial intelligence. Ask questions, seek guidance, and deepen your understanding of Islamic teachings."
            className="text-lg md:text-xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button variant="solid" size="lg">
            Start Exploring
          </Button>
          <Button variant="default" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 w-full px-4 py-24 islamic-pattern">
        <div className="max-w-7xl mx-auto mb-6 text-center">
          <TextShimmer as="h2" className="text-3xl md:text-4xl font-bold mb-4">
            Discover the Knowledge
          </TextShimmer>
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Access the wisdom of renowned Islamic scholars through our AI-powered platform
          </div>

          <div className="w-full h-24 relative mb-12">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={70}
              className="w-full h-full"
              particleColor="#22d3ee"
              speed={0.5}
            />
          </div>
        </div>

        <BentoGrid className="mb-12">
          <BentoGridItem
            title="AI Scholar Chat"
            description="Engage in meaningful conversations with an AI trained on the works of renowned Islamic scholars"
            icon={<MessageSquare className="w-6 h-6" />}
            size="wide"
          />
          <BentoGridItem
            title="Scholar Selection"
            description="Choose from various scholars including Ibn Taymiyyah, Al-Ghazali, and more"
            icon={<BookOpen className="w-6 h-6" />}
            size="tall"
          />
          <BentoGridItem
            title="Scholarly References"
            description="Access citations and references to authentic Islamic sources for deeper understanding"
            icon={<Book className="w-6 h-6" />}
            size="small"
          />
          <BentoGridItem
            title="Voice Responses"
            description="Listen to AI-generated responses with natural text-to-speech technology"
            icon={<Volume2 className="w-6 h-6" />}
            size="small"
          />
          <BentoGridItem
            title="Personalized Experience"
            description="Save your conversations and create a personalized learning journey"
            icon={<User className="w-6 h-6" />}
            size="small"
          />
          <BentoGridItem
            title="Multilingual"
            description="Supports 100+ languages and counting"
            icon={<Globe className="w-6 h-6" />}
            size="wide"
          />
        </BentoGrid>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 border-t border-white/10 glassmorphism">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Islamic Scholar AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}

