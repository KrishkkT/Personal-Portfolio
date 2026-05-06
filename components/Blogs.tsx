"use client";

import { motion } from "framer-motion";
import type { BlogPost } from "@/types/blog";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BlogsProps {
  data: BlogPost[];
  isFullPage?: boolean;
}

export default function Blogs({ data, isFullPage = false }: BlogsProps) {
  const allBlogs = data && data.length > 0 ? data : [];
  // Slice to 3 for home page, show all for full page
  const blogs = isFullPage ? allBlogs : allBlogs.slice(0, 3);
  const hasMore = !isFullPage && allBlogs.length > 3;

  return (
    <section className={`${isFullPage ? "pt-32 pb-24" : "py-24"} px-8`} id="blogs">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-xl font-heading flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" />
            {isFullPage ? "All Articles" : "Recent Writings"}
          </h2>
          {hasMore && (
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-medium text-accent hover:underline">
              View all articles <ArrowRight size={16} />
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="overflow-hidden rounded-2xl mb-6 aspect-video bg-surface border border-border">
                  <img 
                    src={(blog.imageUrls && blog.imageUrls[0]) || "/placeholder.svg?text=Blog"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-textTertiary mb-3">
                  <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}</span>
                  <span className="w-1 h-1 rounded-full bg-textTertiary" />
                  <span>{blog.readingTime} min read</span>
                </div>
                <h3 className="text-lg font-heading mb-3 group-hover:text-accent transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-textSecondary line-clamp-2">
                  {blog.intro}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
        
        {hasMore && (
          <div className="mt-12 text-center md:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-accent">
              View all articles <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {blogs.length === 0 && (
          <div className="col-span-full text-center py-12 text-textSecondary border border-dashed border-border rounded-xl">
            No articles found.
          </div>
        )}
      </div>
    </section>
  );
}
