"use client"

// Fix animejs import - it doesn't have a default export
import * as anime from "animejs"

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
    // Page enter animation
    this.pageEnterAnimation()

    // Setup intersection observer for scroll animations
    this.setupIntersectionObserver()
  }

  private pageEnterAnimation() {
    // Animate page elements on load
    anime.default({
      targets: ".animate-on-load",
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: anime.stagger(100),
      easing: "easeOutQuart",
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

    // Observe elements with animation classes
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })
  }

  private animateElement(element: HTMLElement) {
    const animationType = element.dataset.animation || "fadeInUp"

    switch (animationType) {
      case "fadeInUp":
        anime.default({
          targets: element,
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 600,
          easing: "easeOutQuart",
        })
        break
      case "fadeInLeft":
        anime.default({
          targets: element,
          opacity: [0, 1],
          translateX: [-50, 0],
          duration: 600,
          easing: "easeOutQuart",
        })
        break
      case "fadeInRight":
        anime.default({
          targets: element,
          opacity: [0, 1],
          translateX: [50, 0],
          duration: 600,
          easing: "easeOutQuart",
        })
        break
      case "scaleIn":
        anime.default({
          targets: element,
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 600,
          easing: "easeOutQuart",
        })
        break
      default:
        anime.default({
          targets: element,
          opacity: [0, 1],
          duration: 600,
          easing: "easeOutQuart",
        })
    }
  }

  private setupScrollAnimations() {
    // Smooth scroll behavior
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth"
    }
  }

  // Public methods for triggering animations
  fadeIn(selector: string, options: any = {}) {
    anime.default({
      targets: selector,
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutQuart",
      ...options,
    })
  }

  slideInUp(selector: string, options: any = {}) {
    anime.default({
      targets: selector,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: "easeOutQuart",
      ...options,
    })
  }

  staggerAnimation(selector: string, options: any = {}) {
    anime.default({
      targets: selector,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: anime.stagger(100),
      easing: "easeOutQuart",
      ...options,
    })
  }

  pulseAnimation(selector: string) {
    anime.default({
      targets: selector,
      scale: [1, 1.05, 1],
      duration: 1000,
      easing: "easeInOutQuart",
      loop: true,
    })
  }

  buttonHoverAnimation(element: HTMLElement) {
    anime.default({
      targets: element,
      scale: 1.05,
      duration: 200,
      easing: "easeOutQuart",
    })
  }

  buttonLeaveAnimation(element: HTMLElement) {
    anime.default({
      targets: element,
      scale: 1,
      duration: 200,
      easing: "easeOutQuart",
    })
  }
}

// Export singleton instance
export const animationManager = AnimationManager.getInstance()
