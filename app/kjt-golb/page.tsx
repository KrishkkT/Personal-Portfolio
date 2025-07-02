"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, User, Eye, EyeOff, Shield, Sparkles, Zap, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
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

    // Simple client-side authentication check
    if (username === "thekjt" && password === "passissecret") {
      setIsAuthenticated(true)
      localStorage.setItem("blog-auth", "authenticated")
    } else {
      setError("Invalid username or password")
    }

    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("blog-auth")
    setUsername("")
    setPassword("")
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 backdrop-blur-sm bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-red-400/30 text-red-400 hover:bg-red-400/10 backdrop-blur-sm bg-transparent"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="text-yellow-400 hover:text-yellow-300 transition-colors">
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 backdrop-blur-sm bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
        </Link>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 sm:left-20 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400/30 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-16 sm:right-32 w-4 h-4 sm:w-6 sm:h-6 bg-blue-400/20 rounded-full"
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm sm:max-w-md relative z-10"
      >
        <Card className="midnight-glass border-yellow-400/20 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-6 sm:pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg"
            >
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CardTitle className="text-2xl sm:text-3xl text-white font-bold mb-2">Content Management</CardTitle>
              <p className="text-gray-300 text-xs sm:text-sm">Secure access to portfolio content management system</p>
            </motion.div>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-6"
            >
              <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400">
                <Sparkles className="h-3 w-3 text-yellow-400" />
                <span className="hidden sm:inline">Advanced Editor</span>
                <span className="sm:hidden">Editor</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400">
                <Zap className="h-3 w-3 text-blue-400" />
                <span className="hidden sm:inline">Real-time Management</span>
                <span className="sm:hidden">Management</span>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="pb-6 sm:pb-8">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-2"
              >
                <label htmlFor="username" className="text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9 sm:pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-sm sm:text-base"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="space-y-2"
              >
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 sm:pl-10 pr-9 sm:pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20 text-sm sm:text-base"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-400 text-xs sm:text-sm text-center bg-red-500/10 border border-red-400/20 rounded-lg p-2 sm:p-3"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base py-2 sm:py-3"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-900 border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Access Dashboard</span>
                      <span className="sm:hidden">Login</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-4 sm:mt-6 text-center"
            >
              <p className="text-xs text-gray-500">🔒 Secured with enterprise-grade authentication</p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-4 sm:mt-6 text-center text-xs text-gray-500"
        >
          <p>© 2024 KT Portfolio. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
