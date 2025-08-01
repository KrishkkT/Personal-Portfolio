"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function EnhancedPreloader() {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [audioPlayed, setAudioPlayed] = useState(false)

  const steps = [
    "Initializing Security Protocols...",
    "Loading Portfolio Data...",
    "Establishing Secure Connection...",
    "Preparing User Interface...",
    "Almost Ready...",
  ]

  useEffect(() => {
    // Only play intro sound on initial website load (not on page navigation)
    const playIntroSound = async () => {
      if (!audioPlayed && !sessionStorage.getItem("intro-played")) {
        try {
          const audio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Netflix-Intro-Sound-Effect-MWXvtNsw95Lf2Jl9Y6MwaYDQZzlWnW.mp3")
          audio.volume = 0.3
          audio.preload = "auto"

          // Try to play immediately
          const playPromise = audio.play()

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setAudioPlayed(true)
                sessionStorage.setItem("intro-played", "true")
              })
              .catch((error) => {
                console.log("Audio autoplay prevented:", error)
                // Fallback: try to play on first user interaction
                const handleFirstInteraction = () => {
                  audio.play().catch(console.error)
                  setAudioPlayed(true)
                  sessionStorage.setItem("intro-played", "true")
                  document.removeEventListener("click", handleFirstInteraction)
                  document.removeEventListener("touchstart", handleFirstInteraction)
                  document.removeEventListener("keydown", handleFirstInteraction)
                }

                document.addEventListener("click", handleFirstInteraction)
                document.addEventListener("touchstart", handleFirstInteraction)
                document.addEventListener("keydown", handleFirstInteraction)
              })
          }
        } catch (error) {
          console.error("Error playing intro sound:", error)
        }
      }
    }

    playIntroSound()

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setIsVisible(false)
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [audioPlayed, steps.length])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          data-preloader
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (!isVisible) {
              const preloader = document.querySelector("[data-preloader]")
              if (preloader) {
                preloader.classList.add("preloader-hidden")
              }
            }
          }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 animate-pulse" />

            {/* Animated Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 gap-4 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-yellow-400/20 rounded"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-md mx-auto px-6">
            {/* Logo Animation */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="relative">
                <motion.div
                  className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-black font-bold text-2xl shadow-2xl"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(251, 191, 36, 0.3)",
                      "0 0 40px rgba(251, 191, 36, 0.6)",
                      "0 0 20px rgba(251, 191, 36, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  KT
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Krish Thakker
            </motion.h1>

            <motion.p
              className="text-yellow-400 mb-8 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Cybersecurity Specialist & Full Stack Developer
            </motion.p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Loading</span>
                <span className="text-yellow-400 text-sm font-mono">{progress}%</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={{ x: ["0%", "100%"] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Loading Steps */}
            <motion.div
              className="text-gray-400 text-sm h-6"
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {steps[currentStep]}
            </motion.div>

            {/* Loading Dots */}
            <div className="flex justify-center space-x-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4">
            <motion.div
              className="w-8 h-8 border-l-2 border-t-2 border-yellow-400/50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            />
          </div>
          <div className="absolute top-4 right-4">
            <motion.div
              className="w-8 h-8 border-r-2 border-t-2 border-yellow-400/50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            />
          </div>
          <div className="absolute bottom-4 left-4">
            <motion.div
              className="w-8 h-8 border-l-2 border-b-2 border-yellow-400/50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            />
          </div>
          <div className="absolute bottom-4 right-4">
            <motion.div
              className="w-8 h-8 border-r-2 border-b-2 border-yellow-400/50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
