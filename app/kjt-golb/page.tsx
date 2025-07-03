"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, User, Eye, EyeOff, Shield, Crown, Database, Settings, Sparkles, Star } from "lucide-react"
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
      setError("Invalid credentials. Please check your username and password.")
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
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-red-400/30 text-red-400 hover:bg-red-400/10 backdrop-blur-sm bg-gray-900/50"
          >
            <Lock className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <BlogManagement />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Multiple Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Additional smaller orbs */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-bounce delay-500"></div>

        {/* Enhanced Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? "w-2 h-2 bg-yellow-400/40"
                : i % 3 === 1
                  ? "w-1 h-1 bg-purple-400/40"
                  : "w-1.5 h-1.5 bg-blue-400/40"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {[...Array(144)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-white/10"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
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
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Card className="backdrop-blur-2xl bg-black/30 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 relative overflow-hidden">
            {/* Card Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-400/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400"></div>

            <CardHeader className="text-center pb-8 pt-10 relative">
              {/* Enhanced Logo/Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 150,
                  damping: 12,
                }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-yellow-400/30 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Crown className="h-12 w-12 text-gray-900 relative z-10 drop-shadow-sm" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-ping" />
                <Star className="absolute -bottom-1 -left-1 h-3 w-3 text-yellow-300 animate-pulse" />
              </motion.div>

              {/* Enhanced Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent mb-4">
                  Elite Portal
                </CardTitle>
                <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto">
                  Advanced content management system with enterprise-grade security
                </p>
              </motion.div>

              {/* Enhanced Feature Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex justify-center gap-8 mt-10"
              >
                <motion.div
                  className="flex flex-col items-center group cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-yellow-400/25 transition-all duration-300">
                    <Database className="h-6 w-6 text-yellow-400" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Content Hub</span>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center group cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-blue-400/25 transition-all duration-300">
                    <Settings className="h-6 w-6 text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Management</span>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center group cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-purple-400/25 transition-all duration-300">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Security</span>
                </motion.div>
              </motion.div>
            </CardHeader>

            <CardContent className="pb-10 px-10 relative">
              <form onSubmit={handleLogin} className="space-y-8">
                {/* Enhanced Username Field */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="space-y-3"
                >
                  <label htmlFor="username" className="text-sm font-semibold text-gray-300 flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-yellow-400" />
                    </div>
                    Username
                  </label>
                  <div className="relative group">
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-yellow-400/60 focus:ring-yellow-400/30 h-14 text-base backdrop-blur-sm transition-all duration-300 group-hover:bg-gray-800/80"
                      placeholder="Enter your username"
                      required
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </motion.div>

                {/* Enhanced Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="space-y-3"
                >
                  <label htmlFor="password" className="text-sm font-semibold text-gray-300 flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-yellow-400" />
                    </div>
                    Password
                  </label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-500 focus:border-yellow-400/60 focus:ring-yellow-400/30 h-14 text-base pr-14 backdrop-blur-sm transition-all duration-300 group-hover:bg-gray-800/80"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 z-10"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </motion.div>

                {/* Enhanced Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="text-red-400 text-sm text-center bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-400/30 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-transparent"></div>
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <Shield className="h-5 w-5 text-red-400" />
                        <span className="font-medium">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Login Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-gray-900 font-bold hover:from-yellow-300 hover:via-yellow-400 hover:to-orange-400 transition-all duration-500 shadow-2xl shadow-yellow-400/30 hover:shadow-3xl hover:shadow-yellow-400/40 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none h-14 text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-6 h-6 border-3 border-gray-900 border-t-transparent rounded-full relative z-10"
                      />
                    ) : (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <Crown className="h-6 w-6" />
                        <span>Access Elite Dashboard</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Enhanced Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-10 text-center"
              >
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500 bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span>Military-grade encryption • Zero-trust architecture</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-gray-600 bg-gray-900/20 rounded-2xl p-4 backdrop-blur-sm">
              © 2024 KT Portfolio Elite System. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
