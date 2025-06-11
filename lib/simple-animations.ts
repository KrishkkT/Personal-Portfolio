"use client"

export class SimpleAnimationManager {
  private static instance: SimpleAnimationManager
  private isInitialized = false

  static getInstance(): SimpleAnimationManager {
    if (!SimpleAnimationManager.instance) {
      SimpleAnimationManager.instance = new SimpleAnimationManager()
    }
    return SimpleAnimationManager.instance
  }

  init() {
    if (this.isInitialized || typeof window === "undefined") return

    this.isInitialized = true
    this.setupScrollAnimations()
    this.setupPageAnimations()
  }

  private setupPageAnimations() {
    // Add CSS animations for page load
    const style = document.createElement("style")
    style.textContent = `
      .animate-on-load {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
      }
      
      .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .animate-stagger {
        animation-delay: var(--stagger-delay, 0ms);
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
      }
      
      .fade-in-left {
        animation: fadeInLeft 0.6s ease-out forwards;
      }
      
      .fade-in-right {
        animation: fadeInRight 0.6s ease-out forwards;
      }
      
      .scale-in {
        animation: scaleIn 0.6s ease-out forwards;
      }
    `
    document.head.appendChild(style)
  }

  private setupScrollAnimations() {
    if (typeof window === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const animationType = element.dataset.animation || "fadeInUp"
            const delay = index * 100

            setTimeout(() => {
              element.classList.add("visible")
              element.classList.add(this.getAnimationClass(animationType))
            }, delay)

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

  private getAnimationClass(animationType: string): string {
    switch (animationType) {
      case "fadeInUp":
        return "fade-in-up"
      case "fadeInLeft":
        return "fade-in-left"
      case "fadeInRight":
        return "fade-in-right"
      case "scaleIn":
        return "scale-in"
      default:
        return "fade-in-up"
    }
  }

  // Public methods for manual animations
  animateElement(selector: string, animationType = "fadeInUp", delay = 0) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement
      setTimeout(
        () => {
          htmlElement.classList.add("visible")
          htmlElement.classList.add(this.getAnimationClass(animationType))
        },
        delay + index * 100,
      )
    })
  }

  staggerElements(selector: string, staggerDelay = 100) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement
      htmlElement.style.setProperty("--stagger-delay", `${index * staggerDelay}ms`)
      htmlElement.classList.add("animate-stagger")
    })
  }
}

// Export singleton instance
export const simpleAnimationManager = SimpleAnimationManager.getInstance()
