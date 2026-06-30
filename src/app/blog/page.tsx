import BlogList from "../../components/blog/BlogList";
import { getPosts } from "../../services/Posts";

export const metadata = {
  title: "Journal & Insights — House of Décor",
  description: "Read our latest articles on luxury interior design, sustainable materials, and the art of handcrafted rugs.",
};

export default async function BlogPage() {
  const data = await getPosts();
  const blogs = Array.isArray(data) ? data : [];
  
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <BlogList blogs={blogs} />
    </main>
  );
}
