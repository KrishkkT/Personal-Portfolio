type EventCallback = (data: any) => void

interface EventSubscription {
  unsubscribe: () => void
}

class BlogEventEmitter {
  private events: Map<string, EventCallback[]> = new Map()
  private deletedItems: Set<string> = new Set()

  subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, [])
    }

    const callbacks = this.events.get(eventType)!
    callbacks.push(callback)

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(eventType: string, data: any): void {
    // Track deletions
    if (eventType === "post-deleted" && data.permanent) {
      if (data.deletedId) this.deletedItems.add(data.deletedId)
      if (data.deletedSlug) this.deletedItems.add(data.deletedSlug)
    }

    const callbacks = this.events.get(eventType) || []
    callbacks.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in event callback for ${eventType}:`, error)
      }
    })

    // Also emit as window event for cross-tab communication
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("blog-update", {
          detail: {
            eventType,
            data,
            permanent: eventType === "post-deleted" && data.permanent,
            deletedIds: Array.from(this.deletedItems),
          },
        }),
      )
    }
  }

  isDeleted(id: string): boolean {
    return this.deletedItems.has(id)
  }

  getDeletedItems(): string[] {
    return Array.from(this.deletedItems)
  }

  clearDeletedItems(): void {
    this.deletedItems.clear()
  }
}

// Create singleton instance
export const blogEvents = new BlogEventEmitter()

// Helper function to trigger blog refresh
export function triggerBlogRefresh(eventType: string, data: any): void {
  blogEvents.emit(eventType, data)
}

// Export for use in components
export default blogEvents
