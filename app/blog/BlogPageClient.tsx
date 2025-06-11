"use client"

import { useBlogPosts } from "@/hooks/use-blog-updates"

const BlogPageClient = () => {
  const { posts, loading, error } = useBlogPosts()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}

export default BlogPageClient
