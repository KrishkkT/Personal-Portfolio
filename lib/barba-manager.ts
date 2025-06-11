"use client"

import barba from "@barba/core"
import { AnimationUtils } from "./animation-utils"

export class BarbaManager {
  private static instance: BarbaManager
  private isInitialized = false

  static getInstance(): BarbaManager {
    if (!BarbaManager.instance) {
      BarbaManager.instance = new BarbaManager()
    }
    return BarbaManager.instance
  }

  init() {
    if (this.isInitialized || typeof window === "undefined") return
    this.isInitialized = true

    // Initialize Barba
    barba.init({
      transitions: [
        {
          name: "default-transition",
          leave: (data) => {
            const done = data.trigger()

            // Exit animation
            AnimationUtils.pageTransitionOut(data.current.container, {
              complete: () => {
                done()
              },
            })

            return () => {}
          },
          enter: (data) => {
            // Scroll to top
            window.scrollTo(0, 0)

            // Entry animation
            AnimationUtils.pageTransitionIn(data.next.container)

            // Initialize animations for new page
            this.initPageAnimations()
          },
        },
      ],
      views: [
        {
          namespace: "home",
          beforeEnter: () => {
            // Special animations for home page
            this.initHomeAnimations()
          },
        },
        {
          namespace: "blog",
          beforeEnter: () => {
            // Special animations for blog page
            this.initBlogAnimations()
          },
        },
        {
          namespace: "projects",
          beforeEnter: () => {
            // Special animations for projects page
            this.initProjectsAnimations()
          },
        },
      ],
    })
  }

  // Initialize animations that should run on every page
  initPageAnimations() {
    if (typeof window === "undefined") return

    // Setup intersection observer for scroll animations
    this.setupScrollAnimations()

    // Animate header elements
    AnimationUtils.fadeIn(".site-header", { delay: 300 })

    // Animate footer elements
    AnimationUtils.fadeIn(".site-footer", { delay: 500 })
  }

  // Initialize home page specific animations
  initHomeAnimations() {
    if (typeof window === "undefined") return

    // Hero section animations
    AnimationUtils.textReveal(".hero-title > *")
    AnimationUtils.fadeIn(".hero-subtitle", { delay: 500 })
    AnimationUtils.slideUp(".hero-cta", { delay: 800 })

    // About section animations when visible
    this.animateWhenVisible(".about-section", (el) => {
      AnimationUtils.slideInLeft(".about-text")
      AnimationUtils.slideInRight(".about-image", { delay: 200 })
    })

    // Skills section animations
    this.animateWhenVisible(".skills-section", (el) => {
      AnimationUtils.staggered(".skill-item", "fadeIn")
    })

    // Projects section animations
    this.animateWhenVisible(".projects-section", (el) => {
      AnimationUtils.staggered(".project-card", "scaleIn")
    })

    // Blog section animations
    this.animateWhenVisible(".blog-section", (el) => {
      AnimationUtils.staggered(".blog-post", "slideUp")
    })

    // Contact section animations
    this.animateWhenVisible(".contact-section", (el) => {
      AnimationUtils.fadeIn(".contact-form", { delay: 200 })
    })
  }

  // Initialize blog page specific animations
  initBlogAnimations() {
    if (typeof window === "undefined") return

    // Blog header animations
    AnimationUtils.textReveal(".blog-header-title")

    // Blog posts list animations
    AnimationUtils.staggered(".blog-post-item", "slideUp", { delay: 300 })
  }

  // Initialize projects page specific animations
  initProjectsAnimations() {
    if (typeof window === "undefined") return

    // Projects header animations
    AnimationUtils.textReveal(".projects-header-title")

    // Projects grid animations
    AnimationUtils.staggered(".project-grid-item", "scaleIn", { delay: 300 })
  }

  // Setup scroll-triggered animations
  setupScrollAnimations() {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target
            const animation = element.getAttribute("data-animation") || "fadeIn"

            switch (animation) {
              case "fadeIn":
                AnimationUtils.fadeIn(element)
                break
              case "slideUp":
                AnimationUtils.slideUp(element)
                break
              case "slideInLeft":
                AnimationUtils.slideInLeft(element)
                break
              case "slideInRight":
                AnimationUtils.slideInRight(element)
                break
              case "scaleIn":
                AnimationUtils.scaleIn(element)
                break
              default:
                AnimationUtils.fadeIn(element)
            }

            // Unobserve after animation
            observer.unobserve(element)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe elements with data-animation attribute
    document.querySelectorAll("[data-animation]").forEach((el) => {
      observer.observe(el)
    })
  }

  // Helper to trigger animations when an element becomes visible
  animateWhenVisible(selector: string, callback: (element: Element) => void) {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return

    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    elements.forEach((el) => {
      observer.observe(el)
    })
  }
}

// Export singleton instance
export const barbaManager = BarbaManager.getInstance()
