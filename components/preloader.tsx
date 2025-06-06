"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, Star, Diamond } from "lucide-react"

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  if (!loading) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center royal-gradient"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-8">
          {/* Animated Logo */}
          <div className="relative w-32 h-32 mx-auto">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-12 w-12 text-yellow-400 animate-glow-pulse" />
            </motion.div>

            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Star className="h-6 w-6 text-yellow-400" />
            </motion.div>

            <motion.div
              className="absolute bottom-0 right-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            >
              <Zap className="h-8 w-8 text-yellow-400" />
            </motion.div>

            <motion.div
              className="absolute bottom-0 left-0"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.8 }}
            >
              <Diamond className="h-7 w-7 text-yellow-400" />
            </motion.div>
          </div>

          {/* Loading Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="gradient-text">KT</span>
            </h1>
            <p className="text-gray-300">Cleared for Excellence...</p>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full royal-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}%</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
