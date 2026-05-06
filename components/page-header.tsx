"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { GlassButton } from "./ui/GlassButton"

interface PageHeaderProps {
  title: string
  subtitle: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  showBackButton?: boolean
}

export default function PageHeader({ 
  title, 
  subtitle, 
  description,
  icon: Icon, 
  showBackButton = true 
}: PageHeaderProps) {
  return (
    <section className="pt-32 pb-20 bg-white/10 relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-[120px] -z-10" />

      <div className="container-width relative z-10">
        <motion.div
          className="max-w-4xl"
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
                <GlassButton
                  variant="secondary"
                  className="h-10 px-4 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Hub
                </GlassButton>
              </Link>
            </motion.div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/80 rounded-2xl shadow-sm">
                {Icon ? <Icon className="h-8 w-8 text-blue-600" /> : <Sparkles className="h-8 w-8 text-blue-600" />}
            </div>
            <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-bold text-apple-text tracking-tight">
                    {title} <span className="text-blue-600">{subtitle}</span>
                </h1>
            </div>
          </div>
          
          {description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-apple-muted leading-relaxed max-w-2xl"
            >
                {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
