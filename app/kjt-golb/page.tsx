"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, User, Eye, EyeOff, Shield, Crown } from "lucide-react"
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
    const auth = sessionStorage.getItem("blog-auth")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === "thekjt" && password === "passissecret") {
      setIsAuthenticated(true)
      sessionStorage.setItem("blog-auth", "authenticated")
    } else {
      setError("Invalid credentials.")
    }

    setLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("blog-auth")
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
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Card className="backdrop-blur-2xl bg-black/30 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-400/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400"></div>

            <CardHeader className="text-center pb-8 pt-10 relative">
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
                <Crown className="h-12 w-12 text-gray-900 relative z-10 drop-shadow-sm" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent mb-4">
                  Admin Portal
                </CardTitle>
                <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto">Content management system</p>
              </motion.div>
            </CardHeader>

            <CardContent className="pb-10 px-10 relative">
              <form onSubmit={handleLogin} className="space-y-8">
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
                  </div>
                </motion.div>

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
                  </div>
                </motion.div>

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
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-6 h-6 border-3 border-gray-900 border-t-transparent rounded-full relative z-10"
                      />
                    ) : (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <Crown className="h-6 w-6" />
                        <span>Access Dashboard</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-10 text-center"
              >
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500 bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span>Secure authentication</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
