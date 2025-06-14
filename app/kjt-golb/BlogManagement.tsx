"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  Calendar,
  Clock,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Tag,
  ImageIcon,
  Sparkles,
  PenTool,
  BookOpen,
  Layers,
  Zap,
  Target,
  TrendingUp,
  BarChart,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { BlogPost, BlogPostSummary } from "@/types/blog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import AnalyticsDashboard from "@/components/analytics-dashboard"

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [allTags, setAllTags] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    intro: "",
    content: "",
    tags: "",
    imageUrls: "",
  })
  const [submitStatus, setSubmitStatus] = useState<{
    message: string
    type: "success" | "error" | "loading" | ""
  }>({ message: "", type: "" })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPostSummary | null>(null)
  const [currentView, setCurrentView] = useState<"posts" | "analytics">("posts")

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blog")
      if (!response.ok) throw new Error("Failed to fetch posts")

      const data = await response.json()
      setPosts(data.posts || [])

      // Extract tags
      const tags = new Set<string>()
      data.posts?.forEach((post: BlogPostSummary) => {
        post.tags?.forEach((tag) => tags.add(tag))
      })
      setAllTags(Array.from(tags))
    } catch (error) {
      toast.error("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required")
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      const method = editingPost ? "PUT" : "POST"
      const url = editingPost ? `/api/blog/${editingPost.slug}` : "/api/blog"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          imageUrls: formData.imageUrls ? [formData.imageUrls] : [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save post")
      }

      const result = await response.json()

      if (editingPost) {
        setPosts(posts.map((post) => (post.slug === editingPost.slug ? result.post : post)))
        toast.success("Post updated successfully")
      } else {
        setPosts([result.post, ...posts])
        toast.success("Post created successfully")
      }

      resetForm()
      setSubmitStatus({ message: "Success!", type: "success" })

      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save post"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    }
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    setDeleteDialogOpen(false)
    setSubmitStatus({ message: "Deleting...", type: "loading" })

    try {
      const response = await fetch(`/api/blog/${postToDelete.slug}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete post")
      }

      setPosts(posts.filter((post) => post.slug !== postToDelete.slug))
      toast.success(`Post "${postToDelete.title}" deleted successfully`)
      setSubmitStatus({ message: "Deleted successfully!", type: "success" })

      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete post"
      toast.error(errorMessage)
      setSubmitStatus({ message: errorMessage, type: "error" })
    } finally {
      setPostToDelete(null)
    }
  }

  const startEdit = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      if (!response.ok) throw new Error("Failed to fetch post")

      const post = await response.json()
      setEditingPost(post)
      setFormData({
        title: post.title,
        intro: post.intro,
        content: post.content,
        tags: post.tags?.join(", ") || "",
        imageUrls: post.imageUrls?.[0] || "",
      })
      setIsEditing(true)
    } catch (error) {
      toast.error("Failed to load post for editing")
    }
  }

  const resetForm = () => {
    setEditingPost(null)
    setIsEditing(false)
    setFormData({
      title: "",
      intro: "",
      content: "",
      tags: "",
      imageUrls: "",
    })
  }

  const confirmDeletePost = (post: BlogPostSummary) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.intro.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
      <div className="royal-container">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mb-6">
            <PenTool className="h-10 w-10 text-gray-900" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">Blog Management</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create, edit, and manage your blog posts with our powerful content management system
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <motion.div
              className="midnight-glass rounded-xl p-6 border border-yellow-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Posts</p>
                  <p className="text-3xl font-bold text-white">{posts.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-yellow-400" />
              </div>
            </motion.div>

            <motion.div
              className="midnight-glass rounded-xl p-6 border border-yellow-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Categories</p>
                  <p className="text-3xl font-bold text-white">{allTags.length}</p>
                </div>
                <Layers className="h-8 w-8 text-yellow-400" />
              </div>
            </motion.div>

            <motion.div
              className="midnight-glass rounded-xl p-6 border border-yellow-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Status</p>
                  <p className="text-3xl font-bold text-green-400">Active</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {submitStatus.message && (
            <motion.div
              className={`mb-8 p-6 rounded-xl flex items-center justify-center text-center ${
                submitStatus.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-400/30"
                  : submitStatus.type === "error"
                    ? "bg-red-500/10 text-red-400 border border-red-400/30"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30"
              }`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {submitStatus.type === "loading" && <Loader2 className="h-6 w-6 mr-3 animate-spin" />}
              {submitStatus.type === "success" && <CheckCircle className="h-6 w-6 mr-3" />}
              {submitStatus.type === "error" && <AlertCircle className="h-6 w-6 mr-3" />}
              <span className="text-lg font-medium">{submitStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex gap-4">
            <Button
              onClick={() => setCurrentView("posts")}
              size="lg"
              className={`${
                currentView === "posts"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                  : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              } transition-all duration-300 px-8 py-3 text-lg font-semibold`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Blog Posts
            </Button>

            <Button
              onClick={() => setCurrentView("analytics")}
              size="lg"
              className={`${
                currentView === "analytics"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
                  : "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              } transition-all duration-300 px-8 py-3 text-lg font-semibold`}
            >
              <BarChart className="mr-3 h-5 w-5" />
              Analytics
            </Button>

            {currentView === "posts" && (
              <Button
                onClick={() => setIsEditing(!isEditing)}
                size="lg"
                className={`${
                  isEditing
                    ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                    : "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-300 hover:to-blue-400 shadow-lg hover:shadow-xl"
                } transition-all duration-300 px-8 py-3 text-lg font-semibold`}
              >
                {isEditing ? (
                  <>
                    <Eye className="mr-3 h-5 w-5" />
                    View Posts
                  </>
                ) : (
                  <>
                    <Plus className="mr-3 h-5 w-5" />
                    Create New Post
                  </>
                )}
              </Button>
            )}

            {isEditing && currentView === "posts" && (
              <Button
                variant="outline"
                size="lg"
                onClick={resetForm}
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 px-8 py-3 text-lg"
              >
                <X className="mr-3 h-5 w-5" />
                Cancel
              </Button>
            )}
          </div>
        </motion.div>

        {currentView === "analytics" ? (
          <AnalyticsDashboard />
        ) : isEditing ? (
          /* Enhanced Post Editor Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <Card className="midnight-glass border-yellow-400/20 shadow-2xl">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500">
                      <FileText className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl text-white">
                        {editingPost ? "Edit Post" : "Create New Post"}
                      </CardTitle>
                      <p className="text-gray-400 mt-1">
                        {editingPost ? `Editing: ${editingPost.title}` : "Craft your next amazing blog post"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-gray-400">Auto-save enabled</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Title Section */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-lg font-semibold text-gray-200 flex items-center">
                      <Target className="mr-2 h-5 w-5 text-yellow-400" />
                      Post Title
                      <span className="text-red-400 ml-2">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-800/50 border-gray-600 text-white text-lg h-14 focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-200"
                      placeholder="Enter a compelling title that grabs attention..."
                    />
                    <p className="text-sm text-gray-400">
                      💡 Tip: Great titles are specific, benefit-focused, and under 60 characters
                    </p>
                  </div>

                  <Separator className="bg-gray-700/50" />

                  {/* Introduction Section */}
                  <div className="space-y-3">
                    <Label htmlFor="intro" className="text-lg font-semibold text-gray-200 flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                      Introduction
                      <span className="text-red-400 ml-2">*</span>
                    </Label>
                    <Textarea
                      id="intro"
                      name="intro"
                      value={formData.intro}
                      onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                      className="bg-gray-800/50 border-gray-600 text-white min-h-[120px] text-lg leading-relaxed focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-200"
                      placeholder="Write a compelling introduction that hooks your readers..."
                    />
                    <p className="text-sm text-gray-400">
                      ✨ This appears as the excerpt on your blog listing and social media previews
                    </p>
                  </div>

                  <Separator className="bg-gray-700/50" />

                  {/* Content Section */}
                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-lg font-semibold text-gray-200 flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-yellow-400" />
                      Content
                      <span className="text-red-400 ml-2">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-gray-800/50 border-gray-600 text-white min-h-[400px] text-lg leading-relaxed font-mono focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-200"
                      placeholder="Write your post content using Markdown formatting...

                      ## Use headings to structure your content
                      ### Subheadings help with readability

                      **Bold text** for emphasis
                      *Italic text* for subtle emphasis
                      `code snippets` for technical content

                      - Bullet points for lists
                      - Keep paragraphs short and scannable
                      - Use examples and stories to engage readers"
                    />
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                      <p className="text-sm text-gray-300 mb-2 font-medium">📝 Markdown Quick Reference:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
                        <div>
                          • **bold** → <strong className="text-white">bold</strong>
                        </div>
                        <div>
                          • *italic* → <em className="text-white">italic</em>
                        </div>
                        <div>
                          • ## Heading → <span className="text-white text-lg font-bold">Heading</span>
                        </div>
                        <div>
                          • `code` → <code className="bg-gray-700 px-1 rounded text-yellow-400">code</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-700/50" />

                  {/* Tags and Image Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tags Section */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-gray-200 flex items-center">
                        <Tag className="mr-2 h-5 w-5 text-yellow-400" />
                        Tags
                        <span className="text-red-400 ml-2">*</span>
                      </Label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white h-12 focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-200"
                        placeholder="React, Next.js, Web Development, Tutorial"
                      />
                      <p className="text-sm text-gray-400">
                        🏷️ Separate tags with commas. Use 3-5 relevant tags for best discoverability
                      </p>
                    </div>

                    {/* Featured Image Section */}
                    <div className="space-y-3">
                      <Label htmlFor="imageUrl" className="text-lg font-semibold text-gray-200 flex items-center">
                        <ImageIcon className="mr-2 h-5 w-5 text-yellow-400" />
                        Featured Image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrls}
                        onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white h-12 focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-200"
                        placeholder="https://example.com/featured-image.jpg"
                      />
                      <p className="text-sm text-gray-400">
                        🖼️ Optional: Add a featured image to make your post more engaging
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-8 border-t border-gray-700/50">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold text-lg py-4 hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={submitStatus.type === "loading"}
                    >
                      {submitStatus.type === "loading" ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          {editingPost ? "Updating Post..." : "Creating Post..."}
                        </>
                      ) : (
                        <>
                          <Save className="mr-3 h-5 w-5" />
                          {editingPost ? "Update Post" : "Publish Post"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Enhanced Posts List */
          <div className="space-y-8">
            {/* Search and Filter Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="midnight-glass border-yellow-400/20">
                <CardContent className="pt-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search blog posts by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-gray-800/50 border-gray-600 text-white h-12 text-lg placeholder-gray-400 focus:border-yellow-400/50 focus:ring-yellow-400/20"
                      />
                    </div>
                    <Button
                      onClick={fetchPosts}
                      size="lg"
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
                      Refresh
                    </Button>
                  </div>

                  {/* Enhanced Tag Filter */}
                  {allTags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-700/50">
                      <div className="flex items-center text-gray-300 mb-4">
                        <Filter className="h-5 w-5 mr-2 text-yellow-400" />
                        <span className="font-medium">Filter by category:</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Badge
                          variant={selectedTag === "" ? "default" : "secondary"}
                          className={`cursor-pointer transition-all duration-200 px-4 py-2 text-sm ${
                            selectedTag === ""
                              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                          onClick={() => setSelectedTag("")}
                        >
                          All Posts ({posts.length})
                        </Badge>
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedTag === tag ? "default" : "secondary"}
                            className={`cursor-pointer transition-all duration-200 px-4 py-2 text-sm ${
                              selectedTag === tag
                                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                            onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                          >
                            {tag} ({posts.filter((post) => post.tags?.includes(tag)).length})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Posts Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="midnight-glass rounded-xl p-8 h-80 border border-gray-700/30">
                      <div className="bg-gray-700/50 h-8 rounded-lg mb-6"></div>
                      <div className="bg-gray-700/50 h-4 rounded w-3/4 mb-3"></div>
                      <div className="bg-gray-700/50 h-4 rounded w-1/2 mb-6"></div>
                      <div className="bg-gray-700/50 h-3 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="midnight-glass rounded-2xl p-16 max-w-2xl mx-auto border border-yellow-400/20">
                  <div className="text-8xl mb-8">📝</div>
                  <h3 className="text-3xl font-bold text-white mb-6">No blog posts found</h3>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    {searchTerm || selectedTag
                      ? "Try adjusting your search or filter criteria to find what you're looking for."
                      : "Ready to share your thoughts with the world? Create your first blog post to get started!"}
                  </p>
                  {(searchTerm || selectedTag) && (
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedTag("")
                      }}
                      size="lg"
                      variant="outline"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 px-8 py-3"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 h-full group hover:shadow-2xl hover:shadow-yellow-400/10">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200">
                            {post.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-yellow-400" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-400" />
                            {post.readingTime} min
                          </div>
                        </div>

                        <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">{post.intro}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags?.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs px-3 py-1 hover:bg-yellow-400/20 transition-colors duration-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags && post.tags.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-700/50 text-gray-400 border border-gray-600/50 text-xs px-3 py-1"
                            >
                              +{post.tags.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            onClick={() => startEdit(post.slug)}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 font-medium"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => confirmDeletePost(post)}
                            className="bg-red-500/10 text-red-400 border border-red-400/30 hover:bg-red-500/20 hover:border-red-400/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="midnight-glass border-red-400/30 max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <DialogTitle className="text-2xl text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-300 text-lg leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">"{postToDelete?.title}"</span>?
              This action cannot be undone and will permanently remove the post from your blog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-center pt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30 hover:border-red-400/50 px-8"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
