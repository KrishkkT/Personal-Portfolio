"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Journey", href: "/#journey" },
  { name: "Projects", href: "/#projects" },
  { name: "Certificates", href: "/#certificates" },
  { name: "Blog", href: "/#blog" },
  { name: "Contact", href: "/#contact" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    setIsOpen(false)

    if (href.startsWith("/#")) {
      if (pathname !== "/") {
        // If not on homepage, navigate to homepage first
        window.location.href = href
      } else {
        // If on homepage, smooth scroll to section
        e?.preventDefault()
        const sectionId = href.substring(2)
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }
  }

  const isActiveLink = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href.split("#")[0])) return true
    return false
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "midnight-glass shadow-2xl border-b border-yellow-400/20" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="royal-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-gray-900 font-bold text-xl">KT</span>
              </div>
              <motion.div
                className="absolute -top-1 -right-1"
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
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </motion.div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => {
              const isActive = isActiveLink(item.href)

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={item.href} onClick={(e) => handleNavClick(item.href, e)} className="relative group">
                    <motion.div
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                        isActive
                          ? "text-yellow-400 bg-yellow-400/10"
                          : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden absolute inset-x-0 top-full bg-gray-900/98 backdrop-blur-lg border-t border-yellow-400/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(item.href, e)}
                      className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 transition-all duration-300 hover:text-yellow-400 hover:bg-yellow-400/5"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
