"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { BlogPost, BlogPostSummary, CreateBlogPostRequest } from "@/types/blog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBlogUpdates } from "@/hooks/use-blog-updates"

export default function BlogManagement() {
  // State for posts list
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [allTags, setAllTags] = useState<string[]>([])

  // Edit/Create state
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState<CreateBlogPostRequest>({
    title: "",
    intro: "",
    content: "",
    subheadings: [],
    codeSnippets: [],
    imageUrls: [],
    cta: { text: "Learn More", link: "/contact", type: "internal" },
    conclusion: "",
    tags: [],
    published: true,
  })

  // UI state
  const [newTag, setNewTag] = useState("")
  const [newSubheading, setNewSubheading] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitStatus, setSubmitStatus] = useState<{
    message: string
    type: "success" | "error" | "loading" | ""
  }>({ message: "", type: "" })

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPostSummary | null>(null)

  const { refresh: triggerGlobalRefresh, isConnected } = useBlogUpdates({
    onUpdate: (eventType, data) => {
      console.log(`Management received update: ${eventType}`, data)
      // Automatically refresh the posts list when changes occur
      fetchPosts()
    },
  })

  // Fetch posts with error handling
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setSubmitStatus({ message: "Loading posts...", type: "loading" })

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        _t: Date.now().toString(), // Cache busting
      })

      if (searchTerm) params.append("search", searchTerm)
      if (selectedTag) params.append("tag", selectedTag)

      const response = await fetch(`/api/blog?${params}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch posts")
      }

      const data = await response.json()

      setPosts(data.posts)
      setTotalPages(data.pagination.totalPages)

      // Extract all unique tags
      const tags = new Set<string>()
      data.posts.forEach((post: BlogPostSummary) => {
        post.tags.forEach((tag) => tags.add(tag))
      })
      setAllTags(Array.from(tags))
      setSubmitStatus({ message: "", type: "" })
    } catch (error) {
      console.error("Error fetching posts:", error)
      setSubmitStatus({
        message: `Failed to fetch blog posts: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
      })
      setPosts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, selectedTag])

  // Initial load and when filters change
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Fetch single post for editing with improved error handling
  const fetchPost = async (slug: string) => {
    setSubmitStatus({ message: "Loading post...", type: "loading" })

    try {
      const response = await fetch(`/api/blog/${slug}?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch post")
      }

      const post = await response.json()

      // Set editing post state
      setEditingPost(post)

      // Populate form with post data
      setFormData({
        title: post.title || "",
        intro: post.intro || "",
        content: post.content || "",
        subheadings: post.subheadings || [],
        codeSnippets: post.codeSnippets || [],
        imageUrls: post.imageUrls || [],
        cta: post.cta || { text: "Learn More", link: "/contact", type: "internal" },
        conclusion: post.conclusion || "",
        tags: post.tags || [],
        published: post.published ?? true,
      })

      setSubmitStatus({ message: "", type: "" })
    } catch (error) {
      console.error("Error fetching post:", error)
      setSubmitStatus({
        message: `Failed to load post for editing: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
      })
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Add tag to form
  const handleAddTag = () => {
    if (!newTag.trim()) return
    if (formData.tags.includes(newTag.trim())) {
      setNewTag("")
      return
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }))
    setNewTag("")

    // Clear tag error if it exists
    if (formErrors.tags) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.tags
        return newErrors
      })
    }
  }

  // Remove tag from form
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  // Add subheading to form
  const handleAddSubheading = () => {
    if (!newSubheading.trim()) return
    if (formData.subheadings.includes(newSubheading.trim())) {
      setNewSubheading("")
      return
    }

    setFormData((prev) => ({
      ...prev,
      subheadings: [...prev.subheadings, newSubheading.trim()],
    }))
    setNewSubheading("")
  }

  // Remove subheading from form
  const handleRemoveSubheading = (headingToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      subheadings: prev.subheadings.filter((heading) => heading !== headingToRemove),
    }))
  }

  // Validate form with detailed error messages
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.intro.trim()) errors.intro = "Introduction is required"
    if (!formData.content.trim()) errors.content = "Content is required"
    if (formData.tags.length === 0) errors.tags = "At least one tag is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit form with improved error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus({
        message: "Please fix the form errors before submitting",
        type: "error",
      })
      return
    }

    setSubmitStatus({ message: "Saving...", type: "loading" })

    try {
      let response

      if (editingPost) {
        // Update existing post
        response = await fetch(`/api/blog/${editingPost.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new post
        response = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save post")
      }

      const savedPost = await response.json()

      setSubmitStatus({
        message: editingPost ? "Post updated successfully!" : "Post created successfully!",
        type: "success",
      })

      // Reset form and fetch updated posts
      resetForm()

      // After successful save, trigger global refresh
      triggerGlobalRefresh()
      await fetchPosts()

      // Clear success message after a delay
      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    } catch (error) {
      console.error("Error saving post:", error)
      setSubmitStatus({
        message: `Error: ${error instanceof Error ? error.message : "Failed to save post"}`,
        type: "error",
      })
    }
  }

  // Open delete confirmation dialog
  const confirmDeletePost = (post: BlogPostSummary) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  // Delete post with improved error handling
  const handleDeletePost = async () => {
    if (!postToDelete) return

    setDeleteDialogOpen(false)
    setSubmitStatus({ message: "Deleting post...", type: "loading" })

    try {
      const response = await fetch(`/api/blog/${postToDelete.slug}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete post")
      }

      // Refresh posts

      // After successful deletion, trigger global refresh
      triggerGlobalRefresh()
      await fetchPosts()

      setSubmitStatus({
        message: `Post "${postToDelete.title}" deleted successfully!`,
        type: "success",
      })

      // Clear success message after a delay
      setTimeout(() => {
        setSubmitStatus({ message: "", type: "" })
      }, 3000)
    } catch (error) {
      console.error("Error deleting post:", error)
      setSubmitStatus({
        message: `Error: ${error instanceof Error ? error.message : "Failed to delete post"}`,
        type: "error",
      })
    } finally {
      setPostToDelete(null)
    }
  }

  // Edit post
  const handleEditPost = (slug: string) => {
    fetchPost(slug)
    setIsEditing(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      intro: "",
      content: "",
      subheadings: [],
      codeSnippets: [],
      imageUrls: [],
      cta: { text: "Learn More", link: "/contact", type: "internal" },
      conclusion: "",
      tags: [],
      published: true,
    })
    setEditingPost(null)
    setIsEditing(false)
    setFormErrors({})
  }

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
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-2">
            <div className="flex items-center gap-1">
              {isConnected ? (
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              ) : (
                <div className="h-2 w-2 bg-red-400 rounded-full"></div>
              )}
              <span>{isConnected ? "Real-time sync active" : "Sync offline"}</span>
            </div>
          </div>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence>
          {submitStatus.message && (
            <motion.div
              className={`mb-8 p-4 rounded-lg flex items-center ${
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

        {/* Toggle between post list and editor */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "bg-gray-700 hover:bg-gray-600" : "btn-royal text-black"}
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
          <Card className="midnight-glass border-yellow-400/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {editingPost ? `Edit Post: ${editingPost.title}` : "Create New Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-300">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`bg-gray-800/50 border-gray-700 text-white ${formErrors.title ? "border-red-400" : ""}`}
                    placeholder="Enter post title"
                  />
                  {formErrors.title && <p className="text-sm text-red-400">{formErrors.title}</p>}
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
                    onChange={handleInputChange}
                    className={`bg-gray-800/50 border-gray-700 text-white min-h-[100px] ${
                      formErrors.intro ? "border-red-400" : ""
                    }`}
                    placeholder="Write a brief introduction (will be shown in previews)"
                  />
                  {formErrors.intro && <p className="text-sm text-red-400">{formErrors.intro}</p>}
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
                    onChange={handleInputChange}
                    className={`bg-gray-800/50 border-gray-700 text-white min-h-[300px] ${
                      formErrors.content ? "border-red-400" : ""
                    }`}
                    placeholder="Write your post content in Markdown format"
                  />
                  {formErrors.content && <p className="text-sm text-red-400">{formErrors.content}</p>}
                  <p className="text-xs text-gray-400">
                    Markdown formatting is supported. Use ## for headings, * for lists, etc.
                  </p>
                </div>

                {/* Subheadings */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Subheadings</label>
                  <div className="flex gap-2">
                    <Input
                      value={newSubheading}
                      onChange={(e) => setNewSubheading(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubheading())}
                      className="bg-gray-800/50 border-gray-700 text-white flex-1"
                      placeholder="Add a subheading"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSubheading}
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.subheadings.map((heading, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 pl-2 pr-1 py-1.5 flex items-center gap-1"
                      >
                        {heading}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubheading(heading)}
                          className="ml-1 hover:bg-yellow-400/20 rounded-full p-1"
                          aria-label={`Remove ${heading}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Tags <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className={`bg-gray-800/50 border-gray-700 text-white flex-1 ${
                        formErrors.tags ? "border-red-400" : ""
                      }`}
                      placeholder="Add a tag"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    >
                      Add
                    </Button>
                  </div>
                  {formErrors.tags && <p className="text-sm text-red-400">{formErrors.tags}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 pl-2 pr-1 py-1.5 flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-yellow-400/20 rounded-full p-1"
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label htmlFor="imageUrl" className="text-sm font-medium text-gray-300">
                    Featured Image URL
                  </label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrls[0] || ""}
                    onChange={(e) => {
                      const url = e.target.value
                      setFormData((prev) => ({
                        ...prev,
                        imageUrls: url ? [url] : [],
                      }))
                    }}
                    className="bg-gray-800/50 border-gray-700 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-400">Leave empty to use a placeholder image</p>
                </div>

                {/* Conclusion */}
                <div className="space-y-2">
                  <label htmlFor="conclusion" className="text-sm font-medium text-gray-300">
                    Conclusion
                  </label>
                  <Textarea
                    id="conclusion"
                    name="conclusion"
                    value={formData.conclusion}
                    onChange={handleInputChange}
                    className="bg-gray-800/50 border-gray-700 text-white min-h-[100px]"
                    placeholder="Write a conclusion for your post (optional)"
                  />
                </div>

                {/* Published Status */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800/50 text-yellow-400 focus:ring-yellow-400/20"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-300">
                    Publish immediately
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full btn-royal text-black font-semibold"
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
                    onClick={() => fetchPosts()}
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

            {/* Posts Table */}
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="midnight-glass rounded-xl p-6">
                    <div className="bg-gray-700/50 h-6 rounded mb-4"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-700/50 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
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
              <div className="space-y-4">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="midnight-glass border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
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
                            <p className="text-gray-300 mb-3 line-clamp-2">{post.intro}</p>
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col gap-2 justify-end">
                            <Button
                              size="sm"
                              onClick={() => handleEditPost(post.slug)}
                              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => confirmDeletePost(post)}
                              className="bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={
                          page === currentPage
                            ? "bg-yellow-400 text-gray-900"
                            : "border-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                )}
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
              onClick={handleDeletePost}
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
