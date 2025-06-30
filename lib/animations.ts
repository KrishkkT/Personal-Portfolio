export class AnimationManager {
  private static instance: AnimationManager
  private animations: Map<string, Animation> = new Map()

  private constructor() {}

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager()
    }
    return AnimationManager.instance
  }

  registerAnimation(id: string, animation: Animation): void {
    this.animations.set(id, animation)
  }

  playAnimation(id: string): void {
    const animation = this.animations.get(id)
    if (animation) {
      animation.play()
    }
  }

  pauseAnimation(id: string): void {
    const animation = this.animations.get(id)
    if (animation) {
      animation.pause()
    }
  }

  stopAnimation(id: string): void {
    const animation = this.animations.get(id)
    if (animation) {
      animation.cancel()
      this.animations.delete(id)
    }
  }

  stopAllAnimations(): void {
    this.animations.forEach((animation) => {
      animation.cancel()
    })
    this.animations.clear()
  }
}

export const createFadeInAnimation = (element: HTMLElement, duration = 500): Animation => {
  return element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration,
    easing: "ease-in-out",
    fill: "forwards",
  })
}

export const createSlideInAnimation = (
  element: HTMLElement,
  direction: "left" | "right" | "up" | "down" = "left",
  duration = 500,
): Animation => {
  const transforms = {
    left: ["translateX(-100%)", "translateX(0)"],
    right: ["translateX(100%)", "translateX(0)"],
    up: ["translateY(-100%)", "translateY(0)"],
    down: ["translateY(100%)", "translateY(0)"],
  }

  return element.animate([{ transform: transforms[direction][0] }, { transform: transforms[direction][1] }], {
    duration,
    easing: "ease-out",
    fill: "forwards",
  })
}

export const createScaleAnimation = (element: HTMLElement, fromScale = 0, toScale = 1, duration = 500): Animation => {
  return element.animate([{ transform: `scale(${fromScale})` }, { transform: `scale(${toScale})` }], {
    duration,
    easing: "ease-out",
    fill: "forwards",
  })
}

export const createRotateAnimation = (element: HTMLElement, degrees = 360, duration = 1000): Animation => {
  return element.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${degrees}deg)` }], {
    duration,
    easing: "linear",
    iterations: Number.POSITIVE_INFINITY,
  })
}

export const createBounceAnimation = (element: HTMLElement, intensity = 20, duration = 600): Animation => {
  return element.animate(
    [
      { transform: "translateY(0px)" },
      { transform: `translateY(-${intensity}px)` },
      { transform: "translateY(0px)" },
      { transform: `translateY(-${intensity / 2}px)` },
      { transform: "translateY(0px)" },
    ],
    {
      duration,
      easing: "ease-out",
    },
  )
}

export const createPulseAnimation = (element: HTMLElement, scale = 1.1, duration = 1000): Animation => {
  return element.animate([{ transform: "scale(1)" }, { transform: `scale(${scale})` }, { transform: "scale(1)" }], {
    duration,
    easing: "ease-in-out",
    iterations: Number.POSITIVE_INFINITY,
  })
}

export const createShakeAnimation = (element: HTMLElement, intensity = 10, duration = 600): Animation => {
  return element.animate(
    [
      { transform: "translateX(0px)" },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity / 2}px)` },
      { transform: `translateX(${intensity / 2}px)` },
      { transform: "translateX(0px)" },
    ],
    {
      duration,
      easing: "ease-out",
    },
  )
}

export const createStaggeredAnimations = (
  elements: HTMLElement[],
  animationCreator: (element: HTMLElement) => Animation,
  delay = 100,
): Animation[] => {
  return elements.map((element, index) => {
    const animation = animationCreator(element)
    animation.currentTime = index * delay
    return animation
  })
}

export const animateOnScroll = (
  element: HTMLElement,
  animationCreator: (element: HTMLElement) => Animation,
  options?: IntersectionObserverInit,
): void => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animationCreator(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      }
    })
  }, options)

  observer.observe(element)
}

export const createParallaxEffect = (element: HTMLElement, speed = 0.5): void => {
  const updateParallax = () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -speed
    element.style.transform = `translateY(${rate}px)`
  }

  window.addEventListener("scroll", updateParallax, { passive: true })
}

export const createTypewriterEffect = (element: HTMLElement, text: string, speed = 50): Promise<void> => {
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

export default AnimationManager
