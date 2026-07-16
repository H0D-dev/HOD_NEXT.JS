"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Blog } from "../../lib/data/blogs";

export default function BlogList({ blogs = [] }: { blogs?: Blog[] }) {
  return (
    <section className="w-full py-16 md:py-32 lg:py-48 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-10 md:gap-16 lg:gap-24">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center"
        >
          <span className="block text-[var(--text-secondary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 font-medium">
            Journal
          </span>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--text-primary)] mb-6">
            The Edit
          </h1>
          <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)] max-w-2xl mx-auto">
            Insights, inspiration, and expert advice on luxury interior design, sustainable materials, and the art of hand-crafted rugs.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="group flex flex-col gap-4"
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
              <div className="flex flex-col gap-2 md:gap-3 items-start">
                <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)]">
                  {blog.date}
                </span>
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                <p className="font-sans text-xs md:text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                  {blog.excerpt}
                </p>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-primary)] flex items-center gap-2 mt-2 group/btn"
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
