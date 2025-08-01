"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, User, Briefcase, Award, FileText, Mail } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
  { name: "Home", href: "/", icon: Home, id: "home" },
  { name: "About", href: "/#about", icon: User, id: "about" },
  { name: "Projects", href: "/#projects", icon: Briefcase, id: "projects" },
  { name: "Certificates", href: "/certificates", icon: Award, id: "certificates" },
  { name: "Experience", href: "/experience", icon: FileText, id: "experience" },
  { name: "Contact", href: "/#contact", icon: Mail, id: "contact" },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Don't show navigation on management dashboard
  if (pathname === "/kjt-golb") {
    return null
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = ["home", "about", "projects", "contact"]
      const current = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (current) {
        setActiveSection(current)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string, id: string) => {
    setIsOpen(false)

    if (href.startsWith("/#")) {
      // Hash navigation
      const targetId = href.substring(2)
      if (pathname === "/") {
        // Already on home page, just scroll
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // Navigate to home page with hash
        router.push("/")
        setTimeout(() => {
          const element = document.getElementById(targetId)
          if (element) {
            element.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)
      }
    } else if (href === "/") {
      // Home navigation
      if (pathname === "/") {
        // Already on home, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        // Navigate to home
        router.push("/")
      }
    } else {
      // Regular navigation
      router.push(href)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick("/", "home")}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">KT</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive =
                    (pathname === "/" && item.href.startsWith("/#") && activeSection === item.id) ||
                    (pathname !== "/" && pathname === item.href) ||
                    (item.href === "/" && pathname === "/")

                  return (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavClick(item.href, item.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                        isActive
                          ? "text-yellow-400 bg-yellow-400/10"
                          : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-yellow-400 p-2"
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden bg-gray-900/95 backdrop-blur-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    (pathname === "/" && item.href.startsWith("/#") && activeSection === item.id) ||
                    (pathname !== "/" && pathname === item.href) ||
                    (item.href === "/" && pathname === "/")

                  return (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavClick(item.href, item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${
                        isActive
                          ? "text-yellow-400 bg-yellow-400/10"
                          : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  )
}
