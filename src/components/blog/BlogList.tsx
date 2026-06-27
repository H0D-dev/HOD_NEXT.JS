"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Blog } from "../../lib/data/blogs";

export default function BlogList({ blogs }: { blogs: Blog[] }) {
  return (
    <section className="w-full pt-32 pb-24 md:pt-48 md:pb-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 font-medium">
            Journal
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
            The Edit
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Insights, inspiration, and expert advice on luxury interior design, sustainable materials, and the art of hand-crafted rugs.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="group flex flex-col gap-6"
            >
              <Link href={`/blog/${blog.slug}`} className="w-full aspect-[4/3] relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)] block">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col gap-4 items-start">
                <span className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)]">
                  {blog.date}
                </span>
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className="font-serif text-2xl lg:text-3xl text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                <p className="font-sans text-[var(--text-secondary)] text-base leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="font-sans text-sm font-medium uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2 mt-2 group/btn"
                >
                  Read Article
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
