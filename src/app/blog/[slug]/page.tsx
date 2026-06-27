import { notFound } from "next/navigation";
import { blogs, getBlogBySlug } from "../../../lib/data/blogs";
import BlogContent from "../../../components/blog/BlogContent";

// Generate static params so Next.js knows which dynamic routes exist at build time
export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) {
    return { title: "Blog Not Found" };
  }
  return {
    title: `${blog.title} — House of Décor`,
    description: blog.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  
  if (!blog) {
    notFound();
  }

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <BlogContent blog={blog} />
    </main>
  );
}
