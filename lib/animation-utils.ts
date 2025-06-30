"use client"

// Type definitions for animation options
export interface AnimationOptions {
  duration?: number
  delay?: number
  easing?: string
  direction?: "normal" | "reverse" | "alternate"
  loop?: boolean | number
  autoplay?: boolean
  [key: string]: any
}

// Animation utility class using CSS transitions and transforms
export class AnimationUtils {
  // Fallback CSS animation helper
  private static applyAnimation(
    selector: string | Element | Element[],
    animationType: string,
    options: AnimationOptions = {},
  ) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : [selector]

    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        const duration = options.duration || 600
        const delay = typeof options.delay === "number" ? options.delay : index * 100

        el.style.transition = `all ${duration}ms ease-out`
        el.style.transitionDelay = `${delay}ms`

        // Apply initial state
        switch (animationType) {
          case "fadeIn":
            el.style.opacity = "0"
            break
          case "slideUp":
            el.style.opacity = "0"
            el.style.transform = "translateY(50px)"
            break
          case "slideInLeft":
            el.style.opacity = "0"
            el.style.transform = "translateX(-50px)"
            break
          case "slideInRight":
            el.style.opacity = "0"
            el.style.transform = "translateX(50px)"
            break
          case "scaleIn":
            el.style.opacity = "0"
            el.style.transform = "scale(0.8)"
            break
        }

        // Apply final state after a small delay
        setTimeout(() => {
          el.style.opacity = "1"
          el.style.transform = "translateY(0) translateX(0) scale(1)"
        }, 50)
      }
    })
  }

  // Text reveal animation
  static textReveal(selector: string | Element | Element[], options: AnimationOptions = {}) {
    return this.applyAnimation(selector, "slideUp", options)
  }

  // Fade in animation
  static fadeIn(selector: string | Element | Element[], options: AnimationOptions = {}) {
    return this.applyAnimation(selector, "fadeIn", options)
  }

  // Slide up animation
  static slideUp(selector: string | Element | Element[], options: AnimationOptions = {}) {
    return this.applyAnimation(selector, "slideUp", options)
  }

  // Slide in from left
  static slideInLeft(selector: string | Element | Element[], options: AnimationOptions = {}) {
    return this.applyAnimation(selector, "slideInLeft", options)
  }

  // Slide in from right
  static slideInRight(selector: string | Element | Element[], options: AnimationOptions = {}) {
    return this.applyAnimation(selector, "slideInRight", options)
  }

  // Scale in animation
  static scaleIn(selector: string | Element | Element[], options: AnimationOptions = {}) {
    return this.applyAnimation(selector, "scaleIn", options)
  }

  // Staggered animation for lists
  static staggered(
    selector: string | Element | Element[],
    animation: "fadeIn" | "slideUp" | "slideInLeft" | "slideInRight" | "scaleIn",
    options: AnimationOptions = {},
  ) {
    return this.applyAnimation(selector, animation, options)
  }

  // Page transition out
  static pageTransitionOut(selector: string | Element | Element[] = ".page-content", options: AnimationOptions = {}) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : [selector]

    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.transition = `all ${options.duration || 300}ms ease-in`
        el.style.opacity = "0"
        el.style.transform = "translateY(20px)"
      }
    })
  }

  // Page transition in
  static pageTransitionIn(selector: string | Element | Element[] = ".page-content", options: AnimationOptions = {}) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : [selector]

    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.transition = `all ${options.duration || 600}ms ease-out`
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
      }
    })
  }

  // Simple pulse animation using CSS
  static pulse(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : [selector]

    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.animation = `pulse ${options.duration || 1500}ms ease-in-out infinite`
      }
    })
  }

  // Simple float animation using CSS
  static float(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : [selector]

    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.animation = `float ${options.duration || 3000}ms ease-in-out infinite`
      }
    })
  }

  // Glow animation using CSS
  static glow(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : [selector]

    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.animation = `glow ${options.duration || 1500}ms ease-in-out infinite alternate`
      }
    })

    return {
      stop: () => {
        elements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.animation = ""
          }
        })
      },
    }
  }
}
