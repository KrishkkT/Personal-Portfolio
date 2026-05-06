"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Lock, User, Eye, EyeOff, Shield, LayoutDashboard, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BlogManagement from "./BlogManagement";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Input } from "@/components/ui/input";

export default function BlogManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("blog-auth");
    if (auth === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Maintain existing logic
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (username === "thekjt" && password === "passissecret") {
      setIsAuthenticated(true);
      sessionStorage.setItem("blog-auth", "authenticated");
    } else {
      setError("Invalid credentials. Please try again.");
    }

    setLoading(false);
  };

  if (isAuthenticated) {
    return <BlogManagement />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] relative overflow-hidden flex items-center justify-center p-6">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 blur-[120px] rounded-full opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-10 border-white/40 shadow-xl" gradient>
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10"
            >
              <LayoutDashboard className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-apple-text tracking-tight mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Admin Portal
            </motion.h1>
            <motion.p 
              className="text-apple-muted text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Secure content management system
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-apple-muted ml-1">Username</label>
              <div className="relative">
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/50 border-white/60 focus:bg-white transition-all h-12 rounded-xl pl-10"
                  placeholder="admin_id"
                  required
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-apple-muted ml-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50 border-white/60 focus:bg-white transition-all h-12 rounded-xl pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-apple-muted" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-apple-muted hover:text-apple-text transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3"
                >
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium text-red-600">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <GlassButton
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl mt-4"
              variant="primary"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                "Sign In"
              )}
            </GlassButton>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-apple-muted">
            <div className="w-1 h-1 rounded-full bg-green-500" />
            <span>Encrypted SSL Session</span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
