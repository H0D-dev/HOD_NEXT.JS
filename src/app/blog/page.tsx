import BlogList from "../../components/blog/BlogList";
import { blogs } from "../../lib/data/blogs";

export const metadata = {
  title: "Journal & Insights — House of Décor",
  description: "Read our latest articles on luxury interior design, sustainable materials, and the art of handcrafted rugs.",
};

export default function BlogPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <BlogList blogs={blogs} />
    </main>
  );
}
