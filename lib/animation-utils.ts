export class AnimationUtils {
  static fadeIn(element: HTMLElement, duration = 300): void {
    element.style.opacity = "0"
    element.style.transition = `opacity ${duration}ms ease-in-out`

    requestAnimationFrame(() => {
      element.style.opacity = "1"
    })
  }

  static fadeOut(element: HTMLElement, duration = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease-in-out`
      element.style.opacity = "0"

      setTimeout(() => {
        resolve()
      }, duration)
    })
  }

  static slideIn(element: HTMLElement, direction: "left" | "right" | "up" | "down" = "left", duration = 300): void {
    const transforms = {
      left: "translateX(-100%)",
      right: "translateX(100%)",
      up: "translateY(-100%)",
      down: "translateY(100%)",
    }

    element.style.transform = transforms[direction]
    element.style.transition = `transform ${duration}ms ease-out`

    requestAnimationFrame(() => {
      element.style.transform = "translate(0, 0)"
    })
  }

  static slideOut(
    element: HTMLElement,
    direction: "left" | "right" | "up" | "down" = "left",
    duration = 300,
  ): Promise<void> {
    return new Promise((resolve) => {
      const transforms = {
        left: "translateX(-100%)",
        right: "translateX(100%)",
        up: "translateY(-100%)",
        down: "translateY(100%)",
      }

      element.style.transition = `transform ${duration}ms ease-in`
      element.style.transform = transforms[direction]

      setTimeout(() => {
        resolve()
      }, duration)
    })
  }

  static scaleIn(element: HTMLElement, duration = 300): void {
    element.style.transform = "scale(0)"
    element.style.transition = `transform ${duration}ms ease-out`

    requestAnimationFrame(() => {
      element.style.transform = "scale(1)"
    })
  }

  static scaleOut(element: HTMLElement, duration = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.transition = `transform ${duration}ms ease-in`
      element.style.transform = "scale(0)"

      setTimeout(() => {
        resolve()
      }, duration)
    })
  }

  static bounce(element: HTMLElement, intensity = 10, duration = 600): void {
    const keyframes = [
      { transform: "translateY(0px)" },
      { transform: `translateY(-${intensity}px)` },
      { transform: "translateY(0px)" },
      { transform: `translateY(-${intensity / 2}px)` },
      { transform: "translateY(0px)" },
    ]

    element.animate(keyframes, {
      duration,
      easing: "ease-out",
    })
  }

  static shake(element: HTMLElement, intensity = 10, duration = 600): void {
    const keyframes = [
      { transform: "translateX(0px)" },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity / 2}px)` },
      { transform: `translateX(${intensity / 2}px)` },
      { transform: "translateX(0px)" },
    ]

    element.animate(keyframes, {
      duration,
      easing: "ease-out",
    })
  }

  static pulse(element: HTMLElement, scale = 1.1, duration = 1000): void {
    const keyframes = [{ transform: "scale(1)" }, { transform: `scale(${scale})` }, { transform: "scale(1)" }]

    element.animate(keyframes, {
      duration,
      easing: "ease-in-out",
      iterations: Number.POSITIVE_INFINITY,
    })
  }

  static rotate(element: HTMLElement, degrees = 360, duration = 1000): void {
    element.style.transition = `transform ${duration}ms ease-in-out`
    element.style.transform = `rotate(${degrees}deg)`
  }

  static morphBackground(element: HTMLElement, fromColor: string, toColor: string, duration = 500): void {
    element.style.backgroundColor = fromColor
    element.style.transition = `background-color ${duration}ms ease-in-out`

    requestAnimationFrame(() => {
      element.style.backgroundColor = toColor
    })
  }

  static typewriter(element: HTMLElement, text: string, speed = 50): Promise<void> {
    return new Promise((resolve) => {
      element.textContent = ""
      let i = 0

      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i)
          i++
        } else {
          clearInterval(timer)
          resolve()
        }
      }, speed)
    })
  }

  static parallax(element: HTMLElement, speed = 0.5): void {
    const updateParallax = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      element.style.transform = `translateY(${rate}px)`
    }

    window.addEventListener("scroll", updateParallax, { passive: true })
  }

  static staggeredAnimation(
    elements: NodeListOf<HTMLElement> | HTMLElement[],
    animationFn: (el: HTMLElement) => void,
    delay = 100,
  ): void {
    Array.from(elements).forEach((element, index) => {
      setTimeout(() => {
        animationFn(element)
      }, index * delay)
    })
  }

  static createRipple(element: HTMLElement, event: MouseEvent): void {
    const ripple = document.createElement("span")
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    element.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  static smoothScrollTo(targetId: string, duration = 800): void {
    const target = document.getElementById(targetId)
    if (!target) return

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    let startTime: number | null = null

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    requestAnimationFrame(animation)
  }

  private static easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  static observeIntersection(
    elements: NodeListOf<HTMLElement> | HTMLElement[],
    callback: (element: HTMLElement) => void,
    options?: IntersectionObserverInit,
  ): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        }
      })
    }, options)

    Array.from(elements).forEach((element) => {
      observer.observe(element)
    })
  }
}

export default AnimationUtils
