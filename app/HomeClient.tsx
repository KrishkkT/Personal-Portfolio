"use client"

import PageTransitionWrapper from "@/components/page-transition-wrapper"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import BlogSection from "@/components/blog-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import BackToTop from "@/components/back-to-top"
import { useEffect } from "react"
import { AnimationUtils } from "@/lib/animation-utils"

export default function HomeClient() {
  useEffect(() => {
    // Apply animations to specific elements after component mounts
    const timer = setTimeout(() => {
      // Hero section animations
      AnimationUtils.textReveal(".hero-title")
      AnimationUtils.fadeIn(".hero-subtitle", { delay: 600 })
      AnimationUtils.slideUp(".hero-cta", { delay: 900 })

      // Setup scroll-based animations
      setupScrollAnimations()
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const setupScrollAnimations = () => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            element.classList.add("animate")
            observer.unobserve(element)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe elements with scroll-animate class
    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el)
    })
  }

  return (
    <PageTransitionWrapper namespace="home">
      <Navigation />
      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </PageTransitionWrapper>
  )
}
