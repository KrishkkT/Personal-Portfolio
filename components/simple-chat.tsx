"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SimpleChatProps {
  className?: string
}

export default function SimpleChat({ className = "" }: SimpleChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! 👋 I'm here to help you with KT's portfolio." },
    { type: "bot", text: "Feel free to ask me anything!" },
  ])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    const newMessages = [
      ...messages,
      { type: "user", text: message },
      {
        type: "bot",
        text: "Thanks for your message! This is a demo chat. For real support, please contact KT directly.",
      },
    ]

    setMessages(newMessages)
    setMessage("")
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 h-96 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 p-4 rounded-t-lg">
            <h3 className="font-semibold">Chat Support</h3>
            <p className="text-xs opacity-80">KT Portfolio Assistant</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
              <Button type="submit" size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={handleToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>

        {!isOpen && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />}
      </div>
    </>
  )
}
