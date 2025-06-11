// Event system for real-time blog updates
type BlogEventType = "post-created" | "post-updated" | "post-deleted" | "posts-refreshed"

interface BlogEvent {
  type: BlogEventType
  data: any
  timestamp: number
}

class BlogEventEmitter {
  private listeners: Map<BlogEventType, Set<(data: any) => void>> = new Map()
  private eventHistory: BlogEvent[] = []

  subscribe(eventType: BlogEventType, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback)
    }
  }

  emit(eventType: BlogEventType, data: any) {
    const event: BlogEvent = {
      type: eventType,
      data,
      timestamp: Date.now(),
    }

    // Store event in history
    this.eventHistory.push(event)

    // Keep only last 100 events
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-100)
    }

    // Notify all listeners
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in blog event listener for ${eventType}:`, error)
        }
      })
    }

    // Also emit to 'posts-refreshed' for general updates
    if (eventType !== "posts-refreshed") {
      const refreshListeners = this.listeners.get("posts-refreshed")
      if (refreshListeners) {
        refreshListeners.forEach((callback) => {
          try {
            callback({ eventType, data })
          } catch (error) {
            console.error("Error in posts-refreshed listener:", error)
          }
        })
      }
    }
  }

  getRecentEvents(since?: number): BlogEvent[] {
    if (!since) return this.eventHistory.slice(-10)
    return this.eventHistory.filter((event) => event.timestamp > since)
  }

  clear() {
    this.listeners.clear()
    this.eventHistory = []
  }
}

// Global event emitter instance
export const blogEvents = new BlogEventEmitter()

// Helper function to trigger UI updates
export function triggerBlogRefresh(eventType: BlogEventType, data?: any) {
  blogEvents.emit(eventType, data)

  // Also trigger a custom event for any listening components
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("blog-update", {
        detail: { eventType, data, timestamp: Date.now() },
      }),
    )
  }
}
