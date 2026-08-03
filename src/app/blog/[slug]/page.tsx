import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogContent from "../../../components/blog/BlogContent";
import { getPostBySlug } from "../../../services/Posts";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPostBySlug(slug);
  
  if (!blog) {
    return { title: "House of Decór" };
  }

  const ogImage = blog.image || "https://houseofdecor.ae/about_hero_desktop.png";
  const canonicalUrl = `/blog/${slug}`;

  return {
    title: `${blog.title} — House of Decór`,
    description: blog.excerpt ? blog.excerpt.slice(0, 160) : blog.title,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${blog.title} — House of Decór`,
      description: blog.excerpt ? blog.excerpt.slice(0, 160) : blog.title,
      url: `https://houseofdecor.ae${canonicalUrl}`,
      siteName: "House of Decór",
      type: "article",
      publishedTime: blog.date,
      modifiedTime: blog.modified || blog.date,
      authors: ["House of Decór"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} — House of Decór`,
      description: blog.excerpt ? blog.excerpt.slice(0, 160) : blog.title,
      images: [ogImage],
    },
  };
}

import { generateBlogPostingSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  const blogSchema = generateBlogPostingSchema(blog);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Journal & Insights", url: `${BASE_URL}/blog` },
    { name: blog.title, url: `${BASE_URL}/blog/${blog.slug}` },
  ]);

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogContent blog={blog} nextBlog={null} />
    </main>
  );
}

