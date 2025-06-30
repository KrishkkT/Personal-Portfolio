"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
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
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    setIsOpen(false)

    if (href.startsWith("/#")) {
      if (pathname !== "/") {
        // If not on homepage, navigate to homepage first
        window.location.href = href
      } else {
        // If on homepage, smooth scroll to section
        e.preventDefault()
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" aria-label="KT Portfolio Home">
            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-gray-900 font-bold text-lg sm:text-xl" aria-hidden="true">
                  KT
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1" role="menubar">
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
                  className="relative block px-4 py-3 rounded-lg text-sm font-medium text-white transition-all duration-300 group hover:text-yellow-400"
                  role="menuitem"
                  aria-current={isActiveLink(item.href) ? "page" : undefined}
                >
                  <span className="relative z-10">{item.name}</span>

                  {/* Hover background box */}
                  <motion.div
                    className="absolute inset-0 bg-yellow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-transparent group-hover:border-yellow-400/20"
                    initial={false}
                  />

                  {/* Hover underline */}
                  <motion.div
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "60%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-white hover:text-yellow-400 hover:bg-yellow-400/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              className="lg:hidden absolute inset-x-0 top-full bg-white/10 backdrop-blur-xl border-t border-white/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="px-4 py-4 space-y-1">
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
                      className="relative block px-4 py-3 rounded-lg text-base font-medium text-white transition-all duration-300 group hover:text-yellow-400 hover:bg-yellow-400/10"
                      role="menuitem"
                      aria-current={isActiveLink(item.href) ? "page" : undefined}
                    >
                      <span className="relative z-10">{item.name}</span>

                      {/* Mobile hover underline */}
                      <motion.div
                        className="absolute bottom-1 left-4 h-0.5 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        initial={{ width: 0 }}
                        whileHover={{ width: "calc(100% - 2rem)" }}
                      />

                      {/* Active indicator for mobile */}
                      {isActiveLink(item.href) && (
                        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-yellow-400 rounded-full" />
                      )}
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
