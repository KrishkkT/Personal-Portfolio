import Blogs from "@/components/Blogs";
import { blogStoreSupabase } from "@/lib/blog-store-supabase";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await blogStoreSupabase.getAllPosts();
  
  return (
    <main className="min-h-screen bg-background">
      <Blogs data={posts} isFullPage={true} />
    </main>
  );
}
