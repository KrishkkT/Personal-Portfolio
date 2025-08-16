"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Mail, Sparkles, Zap, Star, Diamond } from "lucide-react"
import { motion } from "framer-motion"
import { dataStore } from "@/lib/data-store"
import type { HeroSection as HeroSectionType } from "@/lib/data-store"

export default function HeroSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [heroData, setHeroData] = useState<HeroSectionType | null>(null)

  useEffect(() => {
    // Mark initial load as complete after preloader
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Load hero data
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const data = await dataStore.getHeroSection()
        setHeroData(data)
      } catch (error) {
        console.error("Error loading hero data:", error)
      }
    }
    loadHeroData()
  }, [])

  const handleSmoothScroll = (targetId: string) => {
    // Only allow smooth scrolling after initial load
    if (!isInitialLoad) {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const typewriterPhrases = [
    "Cloud Infrastructure and Monitoring",
    "Cybersecurity Enthusiast",
    "IT Systems and Automation",
  ]

  const [currentText, setCurrentText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const currentPhrase = typewriterPhrases[phraseIndex]
    const delay = isDeleting ? 150 : 100

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentPhrase.substring(0, charIndex + 1)
        setCurrentText(nextText)
        setCharIndex((prev) => prev + 1)

        if (nextText === currentPhrase) {
          setIsPaused(true)
          setTimeout(() => {
            setIsDeleting(true)
            setIsPaused(false)
          }, 2000)
        }
      } else {
        const words = currentText.trim().split(" ")
        if (words.length > 1) {
          words.pop()
          setCurrentText(words.join(" ") + " ")
        } else {
          setCurrentText("")
          setCharIndex(0)
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length)
        }
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex, currentText, isPaused])

  // Don't render if hero section is not visible
  if (heroData && !heroData.visible) {
    return null
  }

  const name = heroData?.name || "Krish Thakker"
  const description =
    heroData?.description ||
    "Building secure, scalable digital solutions through cybersecurity expertise and innovative development."

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden royal-gradient"
      aria-label="Hero Section"
      itemScope
      itemType="https://schema.org/WPHeader"
    >
      {/* Floating Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 z-0 hidden md:block">
        {/* Golden Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 royal-accent rounded-full blur-xl opacity-20"
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 royal-accent rounded-full blur-xl opacity-15"
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-40 h-40 royal-accent rounded-full blur-xl opacity-10"
          animate={{
            y: [0, -35, 0],
            x: [0, 25, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
          aria-hidden="true"
        />

        {/* Geometric Elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-yellow-400/20 rotate-45"
          animate={{
            rotate: [45, 405, 45],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-12 h-12 royal-accent rounded-lg opacity-30"
          animate={{
            rotate: [0, 360],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden="true"
        />

        {/* Floating Icons */}
        <motion.div
          className="absolute top-1/4 right-1/4"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        >
          <Sparkles className="h-8 w-8 text-yellow-400/30" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/4"
          animate={{
            y: [0, 10, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          aria-hidden="true"
        >
          <Diamond className="h-6 w-6 text-yellow-400/40" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        >
          <Star className="h-7 w-7 text-yellow-400/25" />
        </motion.div>

        <motion.div
          className="absolute top-2/3 right-1/3"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          aria-hidden="true"
        >
          <Zap className="h-5 w-5 text-yellow-400/35" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 royal-container text-center text-white px-4">
        <motion.div
          className="space-y-6 md:space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="space-y-4 md:space-y-6"
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              itemProp="headline"
            >
              <span className="gradient-text">{name}</span>
            </motion.h1>

            <motion.h3
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-yellow-400/80 font-light px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              itemProp="jobTitle"
            >
              {currentText}
              <span className="animate-blink">|</span>
            </motion.h3>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            itemProp="description"
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="btn-royal text-black font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleSmoothScroll("projects")}
                aria-label="View Portfolio Projects"
              >
                View Portfolio
                <ArrowDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="midnight-glass text-white border-yellow-400/30 hover:border-yellow-400/50 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto bg-transparent"
                onClick={() => handleSmoothScroll("contact")}
                aria-label="Contact Krish Thakker"
              >
                Get In Touch
                <Mail className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.8 }}
        aria-hidden="true"
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          onClick={() => handleSmoothScroll("about")}
          aria-label="Scroll to About section"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
          <ArrowDown className="h-5 w-5 text-yellow-400/70" />
        </motion.div>
      </motion.div>
    </section>
  )
}
