"use client"

import { useEffect } from "react"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import SkillsSection from "@/components/skills-section"
import InteractiveCLI from "@/components/interactive-cli"
import CertificatesSection from "@/components/certificates-section"
import TimelineSection from "@/components/timeline-section"
import ProjectsSection from "@/components/projects-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import ClientWrapper from "@/components/client-wrapper"

export default function Home() {
  useEffect(() => {
    // Force scroll to top on component mount
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [])

  return (
    <ClientWrapper>
      <Navigation />
      <div id="home">
        <HeroSection />
      </div>
      <AboutSection />
      <SkillsSection />
      <InteractiveCLI />
      <CertificatesSection />
      <TimelineSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </ClientWrapper>
  )
}
