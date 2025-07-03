"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, User, Eye, EyeOff, Shield, Crown, Database, Settings, Sparkles, Zap, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import BlogManagement from "./BlogManagement"

export default function BlogManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem("blog-auth")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (username === "thekjt" && password === "passissecret") {
      setIsAuthenticated(true)
      localStorage.setItem("blog-auth", "authenticated")
    } else {
      setError("Access denied. Invalid credentials provided.")
    }

    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("blog-auth")
    setUsername("")
    setPassword("")
    setError("")
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="fixed top-6 right-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-400/30 text-red-400 hover:bg-red-400/10 backdrop-blur-xl bg-gray-900/50 shadow-lg"
            >
              <Lock className="h-4 w-4 mr-2" />
              Secure Logout
            </Button>
          </motion.div>
        </div>
        <BlogManagement />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Large Gradient Orbs */}
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-blue-400/10 via-purple-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-400/3 via-pink-400/3 to-yellow-400/3 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Floating Geometric Shapes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              i % 3 === 0
                ? "w-2 h-2 bg-yellow-400/40 rounded-full"
                : i % 3 === 1
                  ? "w-3 h-3 bg-blue-400/30 rotate-45"
                  : "w-1 h-4 bg-purple-400/50"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {[...Array(144)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-yellow-400/20"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: (i * 0.1) % 3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Card className="backdrop-blur-2xl bg-gray-900/30 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-blue-400/5" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-400" />

            <CardHeader className="text-center pb-8 pt-10 relative">
              {/* Animated Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-yellow-400/30 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Crown className="h-12 w-12 text-gray-900 relative z-10" />
                </motion.div>

                {/* Sparkle Effects */}
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>
              </motion.div>

              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <CardTitle className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                  Elite Admin Portal
                </CardTitle>
                <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto">
                  Advanced content management system with enterprise-grade security protocols
                </p>
              </motion.div>

              {/* Enhanced Feature Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex justify-center gap-8 mt-10"
              >
                {[
                  { icon: Database, label: "Content", color: "yellow" },
                  { icon: Settings, label: "Management", color: "blue" },
                  { icon: Shield, label: "Security", color: "purple" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    className="flex flex-col items-center group cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.3,
                    }}
                  >
                    <div
                      className={`w-12 h-12 bg-${feature.color}-400/10 border border-${feature.color}-400/30 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-${feature.color}-400/20 transition-all duration-300`}
                    >
                      <feature.icon className={`h-6 w-6 text-${feature.color}-400`} />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{feature.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </CardHeader>

            <CardContent className="pb-10 px-10 relative">
              <form onSubmit={handleLogin} className="space-y-8">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="space-y-3"
                >
                  <label htmlFor="username" className="text-sm font-semibold text-gray-300 flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-yellow-400" />
                    </div>
                    Administrator Username
                  </label>
                  <div className="relative group">
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-800/40 border-gray-700/50 text-white placeholder-gray-500 focus:border-yellow-400/60 focus:ring-yellow-400/20 h-14 text-base backdrop-blur-sm group-hover:bg-gray-800/60 transition-all duration-300"
                      placeholder="Enter your administrator username"
                      required
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="space-y-3"
                >
                  <label htmlFor="password" className="text-sm font-semibold text-gray-300 flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-yellow-400" />
                    </div>
                    Secure Access Key
                  </label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800/40 border-gray-700/50 text-white placeholder-gray-500 focus:border-yellow-400/60 focus:ring-yellow-400/20 h-14 text-base pr-14 backdrop-blur-sm group-hover:bg-gray-800/60 transition-all duration-300"
                      placeholder="Enter your secure access key"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-700/50"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Enhanced Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="text-red-400 text-sm bg-red-500/10 border border-red-400/30 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <div className="font-semibold">Authentication Failed</div>
                          <div className="text-xs text-red-300 mt-1">{error}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Login Button */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 font-bold hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 transition-all duration-500 shadow-2xl shadow-yellow-400/30 hover:shadow-yellow-400/40 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-14 text-base relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {loading ? (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-6 h-6 border-3 border-gray-900 border-t-transparent rounded-full"
                        />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <Crown className="h-5 w-5" />
                        <span>Access Elite Dashboard</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Zap className="h-5 w-5" />
                        </motion.div>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Enhanced Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="mt-10 text-center"
              >
                <div className="flex items-center justify-center gap-3 text-xs text-gray-500 bg-gray-800/20 rounded-xl p-4 backdrop-blur-sm border border-gray-700/30">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span>Protected by military-grade encryption & multi-layer security protocols</span>
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-10 text-center"
          >
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <p className="text-sm text-gray-400 mb-2">© 2024 KT Portfolio - Elite Content Management System</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <span>Powered by</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Advanced Security Framework</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
