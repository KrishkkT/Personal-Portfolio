"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, User, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
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
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
          >
            Logout
          </Button>
        </div>
        <BlogManagement />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="midnight-glass border-yellow-400/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl text-white">Blog Management</CardTitle>
            <p className="text-gray-300">Please authenticate to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 border border-red-400/20 rounded p-2"
                >
                  {error}
                </motion.div>
              )}

              <Button type="submit" disabled={loading} className="w-full btn-royal text-black font-semibold">
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
