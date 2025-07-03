"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  BarChart3,
  Settings,
  FileText,
  Search,
  Filter,
  Save,
  X,
  Clock,
  Tag,
  ImageIcon,
  LogOut,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { BlogPost } from "@/types/blog"

interface BlogManagementProps {
  onLogout: () => void
}

export default function BlogManagement({ onLogout }: BlogManagementProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    published: false,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blog")
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    try {
      const slug = newPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      const postData = {
        ...newPost,
        slug,
        tags: newPost.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        await fetchPosts()
        setIsCreateDialogOpen(false)
        setNewPost({ title: "", content: "", excerpt: "", tags: "", published: false })
      }
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleUpdatePost = async () => {
    if (!selectedPost) return

    try {
      const response = await fetch(`/api/blog/${selectedPost.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedPost,
          updatedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        await fetchPosts()
        setIsEditDialogOpen(false)
        setSelectedPost(null)
      }
    } catch (error) {
      console.error("Error updating post:", error)
    }
  }

  const handleDeletePost = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPosts()
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleImageUpload = async (file: File, isEdit = false) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const imageMarkdown = `![${file.name}](${data.url})\n\n`

        if (isEdit && selectedPost) {
          setSelectedPost({
            ...selectedPost,
            content: selectedPost.content + imageMarkdown,
          })
        } else {
          setNewPost({
            ...newPost,
            content: newPost.content + imageMarkdown,
          })
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.published).length,
    drafts: posts.filter((p) => !p.published).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header with Navigation */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Blog Management</h1>
                <p className="text-gray-400 text-sm">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button Below Navigation */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-end">
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-red-400/30 text-red-400 hover:bg-red-400/10 backdrop-blur-sm bg-gray-900/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400"
            >
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-blue-400/20 data-[state=active]:text-blue-400"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400"
            >
              <User className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-purple-400/20 data-[state=active]:text-purple-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Total Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                  <p className="text-gray-400 text-sm">All blog posts</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-400" />
                    Published
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{stats.published}</div>
                  <p className="text-gray-400 text-sm">Live posts</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Edit className="h-5 w-5 text-yellow-400" />
                    Drafts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400">{stats.drafts}</div>
                  <p className="text-gray-400 text-sm">Unpublished posts</p>
                </CardContent>
              </Card>
            </div>

            {/* Posts Management */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">Blog Posts</CardTitle>
                    <CardDescription className="text-gray-400">Manage your blog content</CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400">
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Create New Post</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Add a new blog post to your collection
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[70vh] pr-4">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-white">
                              Title
                            </Label>
                            <Input
                              id="title"
                              value={newPost.title}
                              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-white"
                              placeholder="Enter post title"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="excerpt" className="text-white">
                              Excerpt
                            </Label>
                            <Textarea
                              id="excerpt"
                              value={newPost.excerpt}
                              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-white h-20"
                              placeholder="Brief description of the post"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="content" className="text-white">
                                Content
                              </Label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(file, false)
                                  }}
                                  className="hidden"
                                  id="image-upload-new"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById("image-upload-new")?.click()}
                                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                  <ImageIcon className="h-4 w-4 mr-2" />
                                  Add Image
                                </Button>
                              </div>
                            </div>
                            <Textarea
                              id="content"
                              value={newPost.content}
                              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-white min-h-[300px]"
                              placeholder="Write your post content in Markdown format..."
                            />
                            <p className="text-xs text-gray-500">
                              Supports Markdown formatting. Use the "Add Image" button to insert images.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tags" className="text-white">
                              Tags
                            </Label>
                            <Input
                              id="tags"
                              value={newPost.tags}
                              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                              className="bg-gray-800 border-gray-600 text-white"
                              placeholder="Enter tags separated by commas"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="published"
                              checked={newPost.published}
                              onCheckedChange={(checked) => setNewPost({ ...newPost, published: checked })}
                            />
                            <Label htmlFor="published" className="text-white">
                              Publish immediately
                            </Label>
                          </div>

                          <div className="flex justify-end space-x-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsCreateDialogOpen(false)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              onClick={handleCreatePost}
                              className="bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-300 hover:to-green-500"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Create Post
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredPosts.map((post) => (
                        <motion.div
                          key={post.slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50 hover:border-gray-500/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                                <Badge
                                  variant={post.published ? "default" : "secondary"}
                                  className={
                                    post.published
                                      ? "bg-green-400/20 text-green-400 border-green-400/30"
                                      : "bg-yellow-400/20 text-yellow-400 border-yellow-400/30"
                                  }
                                >
                                  {post.published ? "Published" : "Draft"}
                                </Badge>
                              </div>
                              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {Math.ceil(post.content.length / 1000)} min read
                                </div>
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {post.tags.length} tags
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                                    +{post.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                                className="text-gray-400 hover:text-blue-400"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Dialog
                                open={isEditDialogOpen && selectedPost?.slug === post.slug}
                                onOpenChange={(open) => {
                                  setIsEditDialogOpen(open)
                                  if (!open) setSelectedPost(null)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedPost(post)}
                                    className="text-gray-400 hover:text-yellow-400"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Edit Post</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Make changes to your blog post
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedPost && (
                                    <ScrollArea className="max-h-[70vh] pr-4">
                                      <div className="space-y-6">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-title" className="text-white">
                                            Title
                                          </Label>
                                          <Input
                                            id="edit-title"
                                            value={selectedPost.title}
                                            onChange={(e) =>
                                              setSelectedPost({ ...selectedPost, title: e.target.value })
                                            }
                                            className="bg-gray-800 border-gray-600 text-white"
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor="edit-excerpt" className="text-white">
                                            Excerpt
                                          </Label>
                                          <Textarea
                                            id="edit-excerpt"
                                            value={selectedPost.excerpt}
                                            onChange={(e) =>
                                              setSelectedPost({ ...selectedPost, excerpt: e.target.value })
                                            }
                                            className="bg-gray-800 border-gray-600 text-white h-20"
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <Label htmlFor="edit-content" className="text-white">
                                              Content
                                            </Label>
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0]
                                                  if (file) handleImageUpload(file, true)
                                                }}
                                                className="hidden"
                                                id="image-upload-edit"
                                              />
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById("image-upload-edit")?.click()}
                                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                              >
                                                <ImageIcon className="h-4 w-4 mr-2" />
                                                Add Image
                                              </Button>
                                            </div>
                                          </div>
                                          <Textarea
                                            id="edit-content"
                                            value={selectedPost.content}
                                            onChange={(e) =>
                                              setSelectedPost({ ...selectedPost, content: e.target.value })
                                            }
                                            className="bg-gray-800 border-gray-600 text-white min-h-[300px]"
                                          />
                                          <p className="text-xs text-gray-500">
                                            Supports Markdown formatting. Use the "Add Image" button to insert images.
                                          </p>
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor="edit-tags" className="text-white">
                                            Tags
                                          </Label>
                                          <Input
                                            id="edit-tags"
                                            value={selectedPost.tags.join(", ")}
                                            onChange={(e) =>
                                              setSelectedPost({
                                                ...selectedPost,
                                                tags: e.target.value
                                                  .split(",")
                                                  .map((tag) => tag.trim())
                                                  .filter(Boolean),
                                              })
                                            }
                                            className="bg-gray-800 border-gray-600 text-white"
                                          />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id="edit-published"
                                            checked={selectedPost.published}
                                            onCheckedChange={(checked) =>
                                              setSelectedPost({ ...selectedPost, published: checked })
                                            }
                                          />
                                          <Label htmlFor="edit-published" className="text-white">
                                            Published
                                          </Label>
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-4">
                                          <Button
                                            variant="outline"
                                            onClick={() => setIsEditDialogOpen(false)}
                                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={handleUpdatePost}
                                            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-300 hover:to-blue-500"
                                          >
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Post
                                          </Button>
                                        </div>
                                      </div>
                                    </ScrollArea>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePost(post.slug)}
                                className="text-gray-400 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {filteredPosts.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No posts found</h3>
                        <p className="text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "Create your first blog post to get started"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-400">Track your blog performance and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500">Detailed analytics and insights will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-400">Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">User Management Coming Soon</h3>
                  <p className="text-gray-500">User management features will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your blog settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Settings Coming Soon</h3>
                  <p className="text-gray-500">System configuration options will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
