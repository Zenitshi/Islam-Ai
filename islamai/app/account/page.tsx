'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Save, Home, Book, MessageSquare, UserIcon } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import Image from "next/image"
import { api } from '@/app/lib/api'

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Scholars", url: "/scholars", icon: Book },
  { name: "AI Chat", url: "/chat", icon: MessageSquare },
  { name: "Account", url: "/account", icon: UserIcon },
]

type Provider = 'gemini' | 'deepseek'
type ApiKeys = Record<Provider, string>

export default function AccountPage() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    gemini: '',
    deepseek: ''
  })
  const [showKeys, setShowKeys] = useState<Record<Provider, boolean>>({
    gemini: false,
    deepseek: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)

  useEffect(() => {
    // Load saved API keys
    const loadApiKeys = async () => {
      try {
        const providers: Provider[] = ['gemini', 'deepseek']
        const keys: Partial<ApiKeys> = {}
        
        for (const provider of providers) {
          const response = await fetch(api.keys.get(provider))
          const data = await response.json()
          keys[provider] = data.data.key
        }
        
        setApiKeys(keys as ApiKeys)
      } catch (error) {
        console.error('Error loading API keys:', error)
      }
    }

    loadApiKeys()
  }, [])

  const handleSave = async (provider: Provider) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(api.keys.update, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          key: apiKeys[provider],
        }),
      })

      const data = await response.json()
      setMessage(data.message)
    } catch (error) {
      setMessage('Error saving API key')
    } finally {
      setLoading(false)
    }
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

      <div className="relative z-10 flex-1 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
          
          <div className="space-y-6">
            {/* Gemini API Key */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Gemini API Key</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showKeys.gemini ? 'text' : 'password'}
                    value={apiKeys.gemini}
                    onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                    className="pr-10 bg-white/5 border-white/10 text-white"
                    placeholder="Enter your Gemini API key"
                  />
                  <button
                    onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showKeys.gemini ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Button
                  onClick={() => handleSave('gemini')}
                  disabled={loading}
                  className="w-full bg-islamic-cyan/20 hover:bg-islamic-cyan/30 text-islamic-cyan border border-islamic-cyan/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Gemini API Key
                </Button>
              </div>
            </Card>

            {/* Deepseek API Key */}
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Deepseek API Key</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showKeys.deepseek ? 'text' : 'password'}
                    value={apiKeys.deepseek}
                    onChange={(e) => setApiKeys({ ...apiKeys, deepseek: e.target.value })}
                    className="pr-10 bg-white/5 border-white/10 text-white"
                    placeholder="Enter your Deepseek API key"
                  />
                  <button
                    onClick={() => setShowKeys({ ...showKeys, deepseek: !showKeys.deepseek })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showKeys.deepseek ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Button
                  onClick={() => handleSave('deepseek')}
                  disabled={loading}
                  className="w-full bg-islamic-cyan/20 hover:bg-islamic-cyan/30 text-islamic-cyan border border-islamic-cyan/20"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Deepseek API Key
                </Button>
              </div>
            </Card>

            {message && (
              <div className="p-4 rounded-lg bg-islamic-cyan/10 border border-islamic-cyan/20 text-islamic-cyan">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 