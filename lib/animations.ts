"use client"

// Simple animation utilities without external dependencies
export class AnimationManager {
  private static instance: AnimationManager
  private isInitialized = false

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager()
    }
    return AnimationManager.instance
  }

  init() {
    if (this.isInitialized || typeof window === "undefined") return

    this.isInitialized = true
    this.setupPageTransitions()
    this.setupScrollAnimations()
  }

  private setupPageTransitions() {
    // Page enter animation using CSS transitions
    this.pageEnterAnimation()
    this.setupIntersectionObserver()
  }

  private pageEnterAnimation() {
    // Simple fade in animation for page load
    const elements = document.querySelectorAll(".animate-on-load")
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "0"
        el.style.transform = "translateY(30px)"
        el.style.transition = "all 0.8s ease-out"

        setTimeout(() => {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }, index * 100)
      }
    })
  }

  private setupIntersectionObserver() {
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target as HTMLElement)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })
  }

  private animateElement(element: HTMLElement) {
    const animationType = element.dataset.animation || "fadeInUp"

    element.style.transition = "all 0.6s ease-out"

    switch (animationType) {
      case "fadeInUp":
        element.style.opacity = "0"
        element.style.transform = "translateY(50px)"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }, 50)
        break
      case "fadeInLeft":
        element.style.opacity = "0"
        element.style.transform = "translateX(-50px)"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateX(0)"
        }, 50)
        break
      case "fadeInRight":
        element.style.opacity = "0"
        element.style.transform = "translateX(50px)"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "translateX(0)"
        }, 50)
        break
      case "scaleIn":
        element.style.opacity = "0"
        element.style.transform = "scale(0.8)"
        setTimeout(() => {
          element.style.opacity = "1"
          element.style.transform = "scale(1)"
        }, 50)
        break
      default:
        element.style.opacity = "0"
        setTimeout(() => {
          element.style.opacity = "1"
        }, 50)
    }
  }

  private setupScrollAnimations() {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth"
    }
  }

  // Public methods for triggering animations
  fadeIn(selector: string, options: any = {}) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "0"
        el.style.transition = `opacity ${options.duration || 600}ms ease-out`
        setTimeout(
          () => {
            el.style.opacity = "1"
          },
          (options.delay || 0) + index * 100,
        )
      }
    })
  }

  slideInUp(selector: string, options: any = {}) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "0"
        el.style.transform = "translateY(30px)"
        el.style.transition = `all ${options.duration || 600}ms ease-out`
        setTimeout(
          () => {
            el.style.opacity = "1"
            el.style.transform = "translateY(0)"
          },
          (options.delay || 0) + index * 100,
        )
      }
    })
  }

  staggerAnimation(selector: string, options: any = {}) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "0"
        el.style.transform = "translateY(20px)"
        el.style.transition = `all ${options.duration || 600}ms ease-out`
        setTimeout(() => {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }, index * 100)
      }
    })
  }

  pulseAnimation(selector: string) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.animation = "pulse 1s ease-in-out infinite"
      }
    })
  }

  buttonHoverAnimation(element: HTMLElement) {
    element.style.transition = "transform 0.2s ease-out"
    element.style.transform = "scale(1.05)"
  }

  buttonLeaveAnimation(element: HTMLElement) {
    element.style.transition = "transform 0.2s ease-out"
    element.style.transform = "scale(1)"
  }
}

// Export singleton instance
export const animationManager = AnimationManager.getInstance()
