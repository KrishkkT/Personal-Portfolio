// Animation utilities with SSR safety and fallbacks
export class AnimationUtils {
  private static isClient = typeof window !== "undefined"
  private static isAnimationSupported = typeof window !== "undefined" && "animate" in HTMLElement.prototype

  // Pulse animation
  static pulse(
    selector: string | HTMLElement,
    options: {
      scale?: number[]
      duration?: number
      loop?: boolean
    } = {},
  ) {
    if (!this.isClient) return Promise.resolve()

    try {
      const elements = typeof selector === "string" ? document.querySelectorAll(selector) : [selector]

      const promises = Array.from(elements).map((element) => {
        if (!(element instanceof HTMLElement)) return Promise.resolve()

        const { scale = [1, 1.2, 1], duration = 600, loop = false } = options

        if (this.isAnimationSupported) {
          return element.animate(
            [
              { transform: `scale(${scale[0]})` },
              { transform: `scale(${scale[1]})` },
              { transform: `scale(${scale[2]})` },
            ],
            {
              duration,
              iterations: loop ? Number.POSITIVE_INFINITY : 1,
              easing: "ease-in-out",
            },
          ).finished
        } else {
          // CSS fallback
          element.style.animation = `pulse ${duration}ms ease-in-out ${loop ? "infinite" : "1"}`
          return new Promise((resolve) => setTimeout(resolve, duration))
        }
      })

      return Promise.all(promises)
    } catch (error) {
      console.warn("Animation error:", error)
      return Promise.resolve()
    }
  }

  // Float animation
  static float(
    selector: string | HTMLElement,
    options: {
      distance?: number
      duration?: number
      loop?: boolean
    } = {},
  ) {
    if (!this.isClient) return Promise.resolve()

    try {
      const elements = typeof selector === "string" ? document.querySelectorAll(selector) : [selector]

      const promises = Array.from(elements).map((element) => {
        if (!(element instanceof HTMLElement)) return Promise.resolve()

        const { distance = 10, duration = 2000, loop = true } = options

        if (this.isAnimationSupported) {
          return element.animate(
            [
              { transform: "translateY(0px)" },
              { transform: `translateY(-${distance}px)` },
              { transform: "translateY(0px)" },
            ],
            {
              duration,
              iterations: loop ? Number.POSITIVE_INFINITY : 1,
              easing: "ease-in-out",
            },
          ).finished
        } else {
          // CSS fallback
          element.style.animation = `float ${duration}ms ease-in-out ${loop ? "infinite" : "1"}`
          return new Promise((resolve) => setTimeout(resolve, duration))
        }
      })

      return Promise.all(promises)
    } catch (error) {
      console.warn("Animation error:", error)
      return Promise.resolve()
    }
  }

  // Shake animation
  static shake(
    selector: string | HTMLElement,
    options: {
      intensity?: number
      duration?: number
    } = {},
  ) {
    if (!this.isClient) return Promise.resolve()

    try {
      const elements = typeof selector === "string" ? document.querySelectorAll(selector) : [selector]

      const promises = Array.from(elements).map((element) => {
        if (!(element instanceof HTMLElement)) return Promise.resolve()

        const { intensity = 5, duration = 500 } = options

        if (this.isAnimationSupported) {
          return element.animate(
            [
              { transform: "translateX(0)" },
              { transform: `translateX(-${intensity}px)` },
              { transform: `translateX(${intensity}px)` },
              { transform: `translateX(-${intensity}px)` },
              { transform: `translateX(${intensity}px)` },
              { transform: "translateX(0)" },
            ],
            {
              duration,
              easing: "ease-in-out",
            },
          ).finished
        } else {
          // CSS fallback
          element.style.animation = `shake ${duration}ms ease-in-out`
          return new Promise((resolve) => setTimeout(resolve, duration))
        }
      })

      return Promise.all(promises)
    } catch (error) {
      console.warn("Animation error:", error)
      return Promise.resolve()
    }
  }

  // Fade in animation
  static fadeIn(
    selector: string | HTMLElement,
    options: {
      duration?: number
      delay?: number
    } = {},
  ) {
    if (!this.isClient) return Promise.resolve()

    try {
      const elements = typeof selector === "string" ? document.querySelectorAll(selector) : [selector]

      const promises = Array.from(elements).map((element) => {
        if (!(element instanceof HTMLElement)) return Promise.resolve()

        const { duration = 500, delay = 0 } = options

        if (this.isAnimationSupported) {
          return element.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration,
            delay,
            fill: "forwards",
            easing: "ease-out",
          }).finished
        } else {
          // CSS fallback
          setTimeout(() => {
            element.style.transition = `opacity ${duration}ms ease-out`
            element.style.opacity = "1"
          }, delay)
          return new Promise((resolve) => setTimeout(resolve, duration + delay))
        }
      })

      return Promise.all(promises)
    } catch (error) {
      console.warn("Animation error:", error)
      return Promise.resolve()
    }
  }

  // Slide up animation
  static slideUp(
    selector: string | HTMLElement,
    options: {
      distance?: number
      duration?: number
      delay?: number
    } = {},
  ) {
    if (!this.isClient) return Promise.resolve()

    try {
      const elements = typeof selector === "string" ? document.querySelectorAll(selector) : [selector]

      const promises = Array.from(elements).map((element) => {
        if (!(element instanceof HTMLElement)) return Promise.resolve()

        const { distance = 30, duration = 600, delay = 0 } = options

        if (this.isAnimationSupported) {
          return element.animate(
            [
              {
                opacity: 0,
                transform: `translateY(${distance}px)`,
              },
              {
                opacity: 1,
                transform: "translateY(0)",
              },
            ],
            {
              duration,
              delay,
              fill: "forwards",
              easing: "ease-out",
            },
          ).finished
        } else {
          // CSS fallback
          setTimeout(() => {
            element.style.transition = `all ${duration}ms ease-out`
            element.style.opacity = "1"
            element.style.transform = "translateY(0)"
          }, delay)
          return new Promise((resolve) => setTimeout(resolve, duration + delay))
        }
      })

      return Promise.all(promises)
    } catch (error) {
      console.warn("Animation error:", error)
      return Promise.resolve()
    }
  }
}

// Export default and named exports
export default AnimationUtils

// Simple animation utilities object
export const animationUtils = {
  pulse: AnimationUtils.pulse.bind(AnimationUtils),
  float: AnimationUtils.float.bind(AnimationUtils),
  shake: AnimationUtils.shake.bind(AnimationUtils),
  fadeIn: AnimationUtils.fadeIn.bind(AnimationUtils),
  slideUp: AnimationUtils.slideUp.bind(AnimationUtils),
}
