interface N8nChatOptions {
  webhookUrl: string
  target?: HTMLElement
  mode?: "window" | "inline"
  defaultOpen?: boolean
  showWelcomeScreen?: boolean
  initialMessages?: string[]
}

interface N8nChat {
  createChat: (options: N8nChatOptions) => void
}

declare global {
  interface Window {
    n8nChat: N8nChat
  }
}

export {}
