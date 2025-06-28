"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  subtitle: string
  icon?: React.ComponentType<{ className?: string }>
  showBackButton?: boolean
}

export default function PageHeader({ title, subtitle, icon: Icon, showBackButton = true }: PageHeaderProps) {
  return (
    <section className="py-20 royal-gradient">
      <div className="royal-container">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {showBackButton && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/">
                <Button
                  variant="outline"
                  className="midnight-glass text-yellow-400 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10 bg-transparent group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {Icon ? <Icon className="h-6 w-6 text-yellow-400" /> : <Sparkles className="h-6 w-6 text-yellow-400" />}
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              <span className="gradient-text">{title}</span>
            </h1>
            <motion.div
              animate={{
                rotate: [0, -180, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {Icon ? <Icon className="h-6 w-6 text-yellow-400" /> : <Sparkles className="h-6 w-6 text-yellow-400" />}
            </motion.div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
        </motion.div>
      </div>
    </section>
  )
}
