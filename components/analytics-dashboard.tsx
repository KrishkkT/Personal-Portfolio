"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Users, Eye, MousePointer, BookOpen, Globe, TrendingUp, Activity, RefreshCw, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { useAnalytics } from "@/hooks/use-analytics"

const COLORS = ["#fbbf24", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"]

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState(30)
  const { stats, loading, error, refetch } = useAnalytics(selectedPeriod)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="midnight-glass rounded-xl p-6 h-32 border border-gray-700/30">
                <div className="bg-gray-700/50 h-6 rounded mb-4"></div>
                <div className="bg-gray-700/50 h-8 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="midnight-glass rounded-xl p-8 max-w-md mx-auto border border-red-400/20">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-4">Analytics Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={refetch} className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
          <p className="text-gray-400">Track your blog performance and visitor insights</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Period:</span>
          </div>
          {[7, 30, 90].map((days) => (
            <Button
              key={days}
              size="sm"
              variant={selectedPeriod === days ? "default" : "outline"}
              onClick={() => setSelectedPeriod(days)}
              className={
                selectedPeriod === days
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              {days}d
            </Button>
          ))}
          <Button size="sm" onClick={refetch} className="bg-gray-700 text-white hover:bg-gray-600">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="midnight-glass border-yellow-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Visitors</p>
                  <p className="text-3xl font-bold text-white">{stats.totalVisitors.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="midnight-glass border-blue-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Page Views</p>
                  <p className="text-3xl font-bold text-white">{stats.totalPageViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="midnight-glass border-green-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Blog Views</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBlogViews.toLocaleString()}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="midnight-glass border-purple-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Blog Reads</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBlogReads.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="midnight-glass border-orange-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Link Clicks</p>
                  <p className="text-3xl font-bold text-white">{stats.totalLinkClicks.toLocaleString()}</p>
                </div>
                <MousePointer className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Traffic Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Card className="midnight-glass border-yellow-400/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-yellow-400" />
                Daily Traffic Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="visitors" stroke="#fbbf24" strokeWidth={2} dot={{ fill: "#fbbf24" }} />
                  <Line
                    type="monotone"
                    dataKey="blogViews"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visitors by Country */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Card className="midnight-glass border-blue-400/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-400" />
                Visitors by Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.visitorsByCountry}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.visitorsByCountry.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Blog Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="midnight-glass border-green-400/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-green-400" />
              Top Performing Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topBlogPosts.map((post, index) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-yellow-400/20 rounded-full">
                      <span className="text-yellow-400 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{post.title}</h4>
                      <p className="text-gray-400 text-sm">/{post.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-white font-bold">{post.views}</p>
                      <p className="text-gray-400 text-xs">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">{post.reads}</p>
                      <p className="text-gray-400 text-xs">Reads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">{post.clicks}</p>
                      <p className="text-gray-400 text-xs">Clicks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Visitors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="midnight-glass border-purple-400/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-400" />
              Recent Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentVisitors.slice(0, 10).map((visitor, index) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg border border-gray-700/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {visitor.city && visitor.country
                          ? `${visitor.city}, ${visitor.country}`
                          : visitor.country || "Unknown Location"}
                      </p>
                      <p className="text-gray-400 text-xs">{visitor.ip_address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">{new Date(visitor.created_at).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-xs">{new Date(visitor.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
