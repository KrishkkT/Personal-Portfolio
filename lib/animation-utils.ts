// Simple animation utilities using CSS transitions and DOM manipulation
export class AnimationUtils {
  // Fade in animation
  static fadeIn(duration = 0.5) {
    return {
      opacity: 0,
      transition: `opacity ${duration}s ease-in-out`,
      "&.animate": {
        opacity: 1,
      },
    }
  }

  // Slide up animation
  static slideUp(duration = 0.5, distance = 50) {
    return {
      opacity: 0,
      transform: `translateY(${distance}px)`,
      transition: `all ${duration}s ease-out`,
      "&.animate": {
        opacity: 1,
        transform: "translateY(0)",
      },
    }
  }

  // Slide down animation
  static slideDown(duration = 0.5, distance = 50) {
    return {
      opacity: 0,
      transform: `translateY(-${distance}px)`,
      transition: `all ${duration}s ease-out`,
      "&.animate": {
        opacity: 1,
        transform: "translateY(0)",
      },
    }
  }

  // Scale animation
  static scale(duration = 0.5, scale = 0.8) {
    return {
      opacity: 0,
      transform: `scale(${scale})`,
      transition: `all ${duration}s ease-out`,
      "&.animate": {
        opacity: 1,
        transform: "scale(1)",
      },
    }
  }

  // Pulse animation - used by back-to-top component
  static pulse(selector: string, options: { scale?: number[]; duration?: number; loop?: boolean } = {}) {
    const { scale = [1, 1.2, 1], duration = 600, loop = false } = options

    if (typeof window === "undefined") return // SSR safety

    const element = document.querySelector(selector) as HTMLElement
    if (!element) return

    // Create keyframes for pulse animation
    const keyframes = [
      { transform: `scale(${scale[0]})` },
      { transform: `scale(${scale[1]})` },
      { transform: `scale(${scale[2]})` },
    ]

    const animationOptions = {
      duration,
      iterations: loop ? Number.POSITIVE_INFINITY : 1,
      easing: "ease-in-out",
    }

    // Use Web Animations API if available, fallback to CSS
    if (element.animate) {
      element.animate(keyframes, animationOptions)
    } else {
      // Fallback CSS animation
      element.style.animation = `pulse ${duration}ms ease-in-out ${loop ? "infinite" : "1"}`
    }
  }

  // Simple CSS-based animations
  static addFadeInClass(element: HTMLElement) {
    if (!element) return
    element.style.opacity = "0"
    element.style.transition = "opacity 0.5s ease-in-out"

    setTimeout(() => {
      element.style.opacity = "1"
    }, 10)
  }

  static addSlideUpClass(element: HTMLElement) {
    if (!element) return
    element.style.opacity = "0"
    element.style.transform = "translateY(30px)"
    element.style.transition = "all 0.5s ease-out"

    setTimeout(() => {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, 10)
  }

  static addScaleClass(element: HTMLElement) {
    if (!element) return
    element.style.opacity = "0"
    element.style.transform = "scale(0.8)"
    element.style.transition = "all 0.5s ease-out"

    setTimeout(() => {
      element.style.opacity = "1"
      element.style.transform = "scale(1)"
    }, 10)
  }

  // Float animation - used by various components
  static float(selector: string, options: { duration?: number } = {}) {
    const { duration = 2000 } = options

    if (typeof window === "undefined") return // SSR safety

    const element = document.querySelector(selector) as HTMLElement
    if (!element) return

    const keyframes = [
      { transform: "translateY(0px)" },
      { transform: "translateY(-10px)" },
      { transform: "translateY(0px)" },
    ]

    const animationOptions = {
      duration,
      iterations: Number.POSITIVE_INFINITY,
      easing: "ease-in-out",
    }

    if (element.animate) {
      element.animate(keyframes, animationOptions)
    }
  }

  // Shake animation
  static shake(selector: string, options: { duration?: number } = {}) {
    const { duration = 500 } = options

    if (typeof window === "undefined") return // SSR safety

    const element = document.querySelector(selector) as HTMLElement
    if (!element) return

    const keyframes = [
      { transform: "translateX(0)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0)" },
    ]

    const animationOptions = {
      duration,
      iterations: 1,
      easing: "ease-in-out",
    }

    if (element.animate) {
      element.animate(keyframes, animationOptions)
    }
  }
}

export default AnimationUtils
