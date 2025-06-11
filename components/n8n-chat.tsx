"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface N8nChatProps {
  webhookUrl: string
  className?: string
}

export default function N8nChat({ webhookUrl, className = "" }: N8nChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const scriptLoaded = useRef(false)
  const chatInitialized = useRef(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    let timeoutId: NodeJS.Timeout

    // Add CSS
    const link = document.createElement("link")
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    // Add script tag with timeout fallback
    if (!scriptLoaded.current) {
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.umd.js"
      script.async = true

      script.onload = () => {
        clearTimeout(timeoutId)
        scriptLoaded.current = true
        setIsLoading(false)
        setIsLoaded(true)
        console.log("N8n chat script loaded successfully")
        initializeChat()
      }

      script.onerror = (e) => {
        clearTimeout(timeoutId)
        console.error("Failed to load n8n chat script:", e)
        setIsLoading(false)
        setIsLoaded(true) // Enable button even if script fails
      }

      // Timeout fallback - enable button after 5 seconds regardless
      timeoutId = setTimeout(() => {
        console.log("N8n chat loading timeout - enabling button")
        setIsLoading(false)
        setIsLoaded(true)
      }, 5000)

      document.body.appendChild(script)
    } else {
      setIsLoading(false)
      setIsLoaded(true)
      initializeChat()
    }

    function initializeChat() {
      if (chatInitialized.current || !chatContainerRef.current) return

      try {
        // Check if n8nChat is available
        if (typeof window !== "undefined" && (window as any).n8nChat) {
          ;(window as any).n8nChat.createChat({
            webhookUrl,
            target: chatContainerRef.current,
            mode: "window",
            defaultOpen: false,
            showWelcomeScreen: true,
            initialMessages: ["Hello! 👋 I'm here to help you with KT's portfolio."],
          })
          chatInitialized.current = true
          console.log("N8n chat initialized successfully")
        } else {
          console.log("N8n chat library not available, but button will still work")
        }
      } catch (error) {
        console.error("Error initializing chat:", error)
      }
    }

    return () => {
      clearTimeout(timeoutId)
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }
  }, [webhookUrl])

  const handleToggleChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("Chat toggle clicked, current state:", isOpen)

    const newState = !isOpen
    setIsOpen(newState)

    if (chatContainerRef.current) {
      const chatElement = chatContainerRef.current.querySelector(".n8n-chat")
      if (chatElement) {
        ;(chatElement as HTMLElement).style.display = newState ? "block" : "none"
      } else if (newState) {
        // If chat element doesn't exist, show a fallback message
        chatContainerRef.current.innerHTML = `
          <div class="fallback-chat bg-gray-800 rounded-lg p-4 text-white">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-yellow-400">Chat Support</h3>
              <p class="text-sm text-gray-300">Chat is currently unavailable.</p>
            </div>
            <div class="text-xs text-gray-400">
              Please try refreshing the page or contact support directly.
            </div>
          </div>
        `
      } else {
        chatContainerRef.current.innerHTML = ""
      }
    }
  }

  return (
    <>
      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className={`fixed bottom-20 right-4 z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          width: "350px",
          height: "500px",
          maxWidth: "calc(100vw - 2rem)",
          maxHeight: "calc(100vh - 8rem)",
        }}
      />

      {/* Chat Toggle Button */}
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={handleToggleChat}
          disabled={isLoading}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          type="button"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          ) : isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>

        {/* Status indicators */}
        {isLoading && <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />}

        {isLoaded && !isLoading && !isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .fallback-chat {
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .n8n-chat {
          border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          background: rgba(17, 24, 39, 0.95) !important;
        }
        
        .n8n-chat-header {
          background: linear-gradient(135deg, #c9b037 0%, #f4d03f 100%) !important;
          color: #1f2937 !important;
          border-radius: 12px 12px 0 0 !important;
        }
        
        .n8n-chat-messages {
          background: rgba(17, 24, 39, 0.95) !important;
        }
        
        .n8n-chat-input {
          background: rgba(31, 41, 55, 0.8) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0 0 12px 12px !important;
        }
        
        .n8n-chat-message-user {
          background: linear-gradient(135deg, #c9b037 0%, #f4d03f 100%) !important;
          color: #1f2937 !important;
        }
        
        .n8n-chat-message-bot {
          background: rgba(55, 65, 81, 0.8) !important;
          color: #f9fafb !important;
        }
      `}</style>
    </>
  )
}
