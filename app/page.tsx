import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import CertificatesSection from "@/components/certificates-section"
import ContactSection from "@/components/contact-section"
import HomeBlogSection from "@/components/home-blog-section"
import TimelineSection from "@/components/timeline-section"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { Suspense } from "react"
import LoadingFallback from "@/components/loading-fallback"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <div id="journey">
          <TimelineSection />
        </div>
        <CertificatesSection />
        <HomeBlogSection />
        <ContactSection />
        <Footer />
        <BackToTop />
      </Suspense>
    </div>
  )
}
