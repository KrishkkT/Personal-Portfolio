"use client"

// Import anime.js correctly
import * as anime from "animejs"

// Type definitions for animation options
export interface AnimationOptions {
  duration?: number
  delay?: number | ((el: Element, i: number, l: number) => number)
  easing?: string
  direction?: "normal" | "reverse" | "alternate"
  loop?: boolean | number
  autoplay?: boolean
  [key: string]: any
}

// Animation utility class
export class AnimationUtils {
  // Check if anime is available
  private static isAnimeAvailable(): boolean {
    return typeof anime !== "undefined" && anime.default
  }

  // Get anime instance
  private static getAnime() {
    return this.isAnimeAvailable() ? anime.default : null
  }

  // Fallback CSS animation
  private static fallbackAnimation(selector: string | Element | Element[], animationType: string) {
    const elements =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : Array.isArray(selector)
          ? selector
          : [selector]

    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "0"
        el.style.transform = "translateY(20px)"

        setTimeout(() => {
          el.style.transition = "all 0.6s ease-out"
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }, index * 100)
      }
    })
  }

  // Text reveal animation
  static textReveal(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      this.fallbackAnimation(selector, "textReveal")
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: options.duration || 800,
      delay: options.delay || animeInstance.stagger(100),
      easing: options.easing || "easeOutQuad",
      ...options,
    })
  }

  // Fade in animation
  static fadeIn(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      this.fallbackAnimation(selector, "fadeIn")
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [0, 1],
      duration: options.duration || 600,
      delay: options.delay || 0,
      easing: options.easing || "easeInOutQuad",
      ...options,
    })
  }

  // Slide up animation
  static slideUp(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      this.fallbackAnimation(selector, "slideUp")
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: options.duration || 800,
      delay: options.delay || 0,
      easing: options.easing || "easeOutQuad",
      ...options,
    })
  }

  // Slide in from left
  static slideInLeft(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      this.fallbackAnimation(selector, "slideInLeft")
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [0, 1],
      translateX: [-50, 0],
      duration: options.duration || 800,
      delay: options.delay || 0,
      easing: options.easing || "easeOutQuad",
      ...options,
    })
  }

  // Slide in from right
  static slideInRight(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      this.fallbackAnimation(selector, "slideInRight")
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [0, 1],
      translateX: [50, 0],
      duration: options.duration || 800,
      delay: options.delay || 0,
      easing: options.easing || "easeOutQuad",
      ...options,
    })
  }

  // Scale in animation
  static scaleIn(selector: string | Element | Element[], options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      this.fallbackAnimation(selector, "scaleIn")
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: options.duration || 800,
      delay: options.delay || 0,
      easing: options.easing || "easeOutQuad",
      ...options,
    })
  }

  // Staggered animation for lists
  static staggered(
    selector: string | Element | Element[],
    animation: "fadeIn" | "slideUp" | "slideInLeft" | "slideInRight" | "scaleIn",
    options: AnimationOptions = {},
  ) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      this.fallbackAnimation(selector, animation)
      return
    }

    const baseOptions = {
      ...options,
      delay: options.delay || animeInstance.stagger(100),
    }

    switch (animation) {
      case "fadeIn":
        return this.fadeIn(selector, baseOptions)
      case "slideUp":
        return this.slideUp(selector, baseOptions)
      case "slideInLeft":
        return this.slideInLeft(selector, baseOptions)
      case "slideInRight":
        return this.slideInRight(selector, baseOptions)
      case "scaleIn":
        return this.scaleIn(selector, baseOptions)
      default:
        return this.fadeIn(selector, baseOptions)
    }
  }

  // Page transition out
  static pageTransitionOut(selector: string | Element | Element[] = ".page-content", options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      const elements =
        typeof selector === "string"
          ? document.querySelectorAll(selector)
          : Array.isArray(selector)
            ? selector
            : [selector]
      elements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.transition = "all 0.3s ease-in"
          el.style.opacity = "0"
          el.style.transform = "translateY(20px)"
        }
      })
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [1, 0],
      translateY: [0, 20],
      duration: options.duration || 300,
      easing: options.easing || "easeInQuad",
      ...options,
    })
  }

  // Page transition in
  static pageTransitionIn(selector: string | Element | Element[] = ".page-content", options: AnimationOptions = {}) {
    const animeInstance = this.getAnime()

    if (!animeInstance) {
      const elements =
        typeof selector === "string"
          ? document.querySelectorAll(selector)
          : Array.isArray(selector)
            ? selector
            : [selector]
      elements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.transition = "all 0.6s ease-out"
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }
      })
      return
    }

    return animeInstance({
      targets: selector,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: options.duration || 600,
      easing: options.easing || "easeOutQuad",
      ...options,
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
