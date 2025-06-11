"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export default function FallbackChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! 👋 I'm here to help you with any questions about KT's portfolio or blog management.",
    },
    {
      type: "bot",
      content: "Feel free to ask me anything!",
    },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: message }])

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Thanks for your message! This is a fallback chat. For full functionality, please try again later.",
        },
      ])
    }, 1000)

    setMessage("")
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-40 w-80 md:w-96"
          >
            <Card className="border-yellow-400/20 shadow-xl bg-gray-900/95 backdrop-blur-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-t-lg">
                <CardTitle className="text-gray-900 text-lg flex items-center justify-between">
                  <span>Chat Support</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-gray-900/10 hover:bg-gray-900/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4 text-gray-900" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-80 overflow-y-auto flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 ml-auto"
                        : "bg-gray-800 text-gray-100"
                    } p-3 rounded-lg max-w-[80%] ${msg.type === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}
                  >
                    {msg.content}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-3 border-t border-gray-800">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                  <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </>
  )
}
