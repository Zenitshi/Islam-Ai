"use client"

import { useState } from "react"
import Image from "next/image"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { Button } from "@/components/ui/neon-button"
import { Home, Book, MessageSquare, User, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

// Mock scholars data
const scholarsData = [
  {
    id: "ibn-taymiyyah",
    name: "Ibn Taymiyyah",
    period: "1263-1328 CE",
    expertise: ["Hanbali Jurisprudence", "Theology", "Philosophy"],
    description:
      "A prominent figure in the Hanbali school of thought, known for his extensive knowledge and influential works on Islamic jurisprudence and theology.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "al-ghazali",
    name: "Al-Ghazali",
    period: "1058-1111 CE",
    expertise: ["Sufism", "Philosophy", "Theology"],
    description:
      "One of the most influential Muslim philosophers, theologians, and mystics. His works had a significant impact on Islamic thought and spirituality.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ibn-kathir",
    name: "Ibn Kathir",
    period: "1300-1373 CE",
    expertise: ["Quranic Exegesis", "Hadith", "History"],
    description:
      "A highly influential scholar known for his famous tafsir (Quranic exegesis) and historical works that continue to be widely studied today.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "ibn-qayyim",
    name: "Ibn Qayyim al-Jawziyya",
    period: "1292-1350 CE",
    expertise: ["Hanbali Jurisprudence", "Ethics", "Spirituality"],
    description:
      "A prominent scholar and student of Ibn Taymiyyah, known for his works on Islamic jurisprudence, theology, and spirituality.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "imam-malik",
    name: "Imam Malik",
    period: "711-795 CE",
    expertise: ["Jurisprudence", "Hadith"],
    description:
      "The founder of the Maliki school of jurisprudence and compiler of one of the earliest collections of hadith, Al-Muwatta.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "imam-shafi",
    name: "Imam Shafi'i",
    period: "767-820 CE",
    expertise: ["Jurisprudence", "Principles of Jurisprudence"],
    description:
      "The founder of the Shafi'i school of jurisprudence and a pioneer in the development of usul al-fiqh (principles of Islamic jurisprudence).",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function ScholarsPage() {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Scholars", url: "/scholars", icon: Book },
    { name: "AI Chat", url: "/chat", icon: MessageSquare },
    { name: "Account", url: "/account", icon: User },
  ]

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

      <div className="relative z-10 flex flex-col w-full max-w-7xl mx-auto px-4 pt-20 pb-24">
        <div className="text-center mb-12">
          <Avatar className="w-16 h-16 mb-4 mx-auto">
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_islam-dZoMpBTWvkdL6CGcZKJaqwRjft5gCF.png"
              alt="Islamic Scholar AI Logo"
            />
            <AvatarFallback className="bg-islamic-cyan/20">ISA</AvatarFallback>
          </Avatar>
          <TextShimmer as="h1" className="text-3xl md:text-5xl font-bold mb-4 font-arabic">
            Islamic Scholars
          </TextShimmer>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the wisdom and teachings of renowned Islamic scholars throughout history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarsData.map((scholar) => (
            <motion.div
              key={scholar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glassmorphism rounded-xl p-6 flex flex-col items-center text-center h-full"
            >
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-islamic-cyan/30" />
                <Image
                  src={scholar.image || "/placeholder.svg"}
                  alt={scholar.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold font-arabic mb-1">{scholar.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{scholar.period}</p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {scholar.expertise.map((area) => (
                  <span
                    key={area}
                    className="text-xs px-3 py-1 rounded-full bg-islamic-blue/20 border border-islamic-blue/30"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 flex-grow">{scholar.description}</p>
              <Button
                variant="default"
                size="sm"
                className="w-full mt-auto flex items-center justify-center gap-1"
                onClick={() => (window.location.href = `/chat?scholar=${scholar.id}`)}
              >
                Chat with AI <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}

