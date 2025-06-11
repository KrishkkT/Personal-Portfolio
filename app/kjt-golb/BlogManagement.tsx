"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Blog Management</h1>
          <p className="text-xl text-gray-300">Create, edit, and manage your blog posts</p>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {submitStatus.message && (
            <motion.div
              className={`mb-8 p-4 rounded-lg flex items-center justify-center ${
                submitStatus.type === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-400/30"
                  : submitStatus.type === "error"
                    ? "bg-red-500/20 text-red-400 border border-red-400/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {submitStatus.type === "loading" && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {submitStatus.type === "success" && <CheckCircle className="h-5 w-5 mr-2" />}
              {submitStatus.type === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
              <span>{submitStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`${
              isEditing
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400"
            } transition-all duration-300`}
          >
            {isEditing ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                View Posts
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </>
            )}
          </Button>

          {isEditing && (
            <Button
              variant="outline"
              onClick={resetForm}
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>

        {isEditing ? (
          /* Post Editor Form */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="midnight-glass border-yellow-400/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-yellow-400" />
                  {editingPost ? `Edit Post: ${editingPost.title}` : "Create New Post"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-300 flex items-center">
                      <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
                      Title <span className="text-red-400 ml-1">*</span>
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-400/50"
                      placeholder="Enter an engaging title..."
                    />
                  </div>

                  {/* Introduction */}
                  <div className="space-y-2">
                    <label htmlFor="intro" className="text-sm font-medium text-gray-300">
                      Introduction <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      id="intro"
                      name="intro"
                      value={formData.intro}
                      onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white min-h-[100px] focus:border-yellow-400/50"
                      placeholder="Write a compelling introduction..."
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium text-gray-300">
                      Content <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white min-h-[300px] focus:border-yellow-400/50"
                      placeholder="Write your post content in Markdown format..."
                    />
                    <p className="text-xs text-gray-400">
                      💡 Tip: Use Markdown formatting for rich content (## for headings, * for lists, etc.)
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <Tag className="mr-2 h-4 w-4 text-yellow-400" />
                      Tags <span className="text-red-400 ml-1">*</span>
                    </label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-400/50"
                      placeholder="React, Next.js, Web Development (comma separated)"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <label htmlFor="imageUrl" className="text-sm font-medium text-gray-300 flex items-center">
                      <ImageIcon className="mr-2 h-4 w-4 text-yellow-400" />
                      Featured Image URL
                    </label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrls}
                      onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white focus:border-yellow-400/50"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300"
                      disabled={submitStatus.type === "loading"}
                    >
                      {submitStatus.type === "loading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingPost ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {editingPost ? "Update Post" : "Create Post"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Posts List */
          <div className="space-y-8">
            {/* Search and Filter */}
            <Card className="midnight-glass border-yellow-400/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                    />
                  </div>
                  <Button
                    onClick={fetchPosts}
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Refresh
                  </Button>
                </div>

                {/* Tag Filter */}
                {allTags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center text-gray-300 mb-2">
                      <Filter className="h-4 w-4 mr-1" />
                      <span>Filter by tag:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTag === tag ? "default" : "secondary"}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedTag === tag
                              ? "bg-yellow-400 text-gray-900"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                          onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Posts Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="midnight-glass rounded-xl p-6 h-64">
                      <div className="bg-gray-700/50 h-6 rounded mb-4"></div>
                      <div className="bg-gray-700/50 h-4 rounded w-3/4 mb-2"></div>
                      <div className="bg-gray-700/50 h-4 rounded w-1/2 mb-4"></div>
                      <div className="bg-gray-700/50 h-3 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 midnight-glass rounded-xl">
                <h3 className="text-2xl font-bold text-white mb-4">No blog posts found</h3>
                <p className="text-gray-300 mb-6">
                  {searchTerm || selectedTag
                    ? "Try adjusting your search or filter criteria."
                    : "Create your first blog post to get started!"}
                </p>
                {(searchTerm || selectedTag) && (
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedTag("")
                    }}
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h3>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min read
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4 line-clamp-3">{post.intro}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags?.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => startEdit(post.slug)}
                            className="flex-1 bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => confirmDeletePost(post)}
                            className="bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="midnight-glass border-red-400/30">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30"
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
