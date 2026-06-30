import { notFound } from "next/navigation";
import BlogContent from "../../../components/blog/BlogContent";
import { getPosts, getPostBySlug } from "../../../services/Posts";

export async function generateStaticParams() {
  const blogs = await getPosts();
  if (!blogs || !Array.isArray(blogs)) return [];
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

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
  const blog = await getPostBySlug(slug);
  
  if (!blog) {
    notFound();
  }

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <BlogContent blog={blog} />
    </main>
  );
}
