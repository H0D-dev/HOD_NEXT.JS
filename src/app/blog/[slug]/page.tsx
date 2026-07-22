import { notFound } from "next/navigation";
import BlogContent from "../../../components/blog/BlogContent";
import { getPosts, getPostBySlug } from "../../../services/Posts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getPostBySlug(slug);
  
  if (!blog) {
    return { title: "House of Décor" };
  }
  return {
    title: `${blog.title} — House of Décor`,
    description: blog.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  
  if (!posts || posts.error || !Array.isArray(posts)) {
    notFound();
  }

  const currentIndex = posts.findIndex(p => p.slug.toLowerCase() === slug.toLowerCase());
  
  if (currentIndex === -1) {
    notFound();
  }

  const blog = posts[currentIndex];
  // Determine next blog (loop back to first if at the end)
  const nextBlog = posts.length > 1 ? posts[(currentIndex + 1) % posts.length] : null;

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <BlogContent blog={blog} nextBlog={nextBlog} />
    </main>
  );
}
