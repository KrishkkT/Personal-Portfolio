"use client"

import { useState, useCallback } from "react"

interface ChatState {
  isOpen: boolean
  isLoaded: boolean
  hasNewMessages: boolean
}

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    isLoaded: false,
    hasNewMessages: false,
  })

  const toggleChat = useCallback(() => {
    setChatState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      hasNewMessages: prev.isOpen ? false : prev.hasNewMessages,
    }))
  }, [])

  const setChatLoaded = useCallback((loaded: boolean) => {
    setChatState((prev) => ({
      ...prev,
      isLoaded: loaded,
    }))
  }, [])

  const setNewMessages = useCallback((hasNew: boolean) => {
    setChatState((prev) => ({
      ...prev,
      hasNewMessages: hasNew,
    }))
  }, [])

  return {
    ...chatState,
    toggleChat,
    setChatLoaded,
    setNewMessages,
  }
}
