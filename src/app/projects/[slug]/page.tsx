import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, Layers, Sparkles, CheckCircle2 } from "lucide-react";
import { getProjects, getProjectBySlug } from "@/src/lib/data/projects";
import { generateProjectSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Case Study | House of Decór" };
  }

  const canonicalUrl = `/projects/${project.slug}`;
  const ogImageUrl = project.heroImage.startsWith("http")
    ? project.heroImage
    : `https://houseofdecor.ae${project.heroImage}`;

  return {
    title: `${project.title} — ${project.category} Portfolio Case Study`,
    description: project.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${project.title} — ${project.subtitle} | House of Decór`,
      description: project.summary,
      url: `https://houseofdecor.ae${canonicalUrl}`,
      siteName: "House of Decór",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | House of Decór Portfolio`,
      description: project.summary,
      images: [ogImageUrl],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectSchema = generateProjectSchema(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Projects", url: `${BASE_URL}/projects` },
    { name: project.title, url: `${BASE_URL}/projects/${project.slug}` },
  ]);

  return (
    <article className="w-full bg-[var(--bg-primary)] pt-24 lg:pt-32 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[1240px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* Header Title Block */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--accent-primary)] font-medium mb-3">
            <span>{project.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {project.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {project.year}
            </span>
          </div>

          <h1 className="font-sans font-light text-3xl md:text-5xl lg:text-6xl text-[var(--text-primary)] leading-tight mb-4">
            {project.title}
          </h1>
          <p className="font-sans text-lg md:text-xl text-[var(--text-secondary)] font-light max-w-3xl leading-relaxed">
            {project.subtitle}
          </p>
        </header>

        {/* Hero Image */}
        <div className="w-full relative h-[380px] md:h-[550px] lg:h-[650px] rounded-sm overflow-hidden mb-16 border border-[var(--border-secondary)] shadow-sm bg-[var(--bg-secondary)]">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Main Content & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--accent-primary)] mb-4">
                Executive Summary
              </h2>
              <p className="font-sans text-base md:text-lg leading-relaxed text-[var(--text-primary)] font-light">
                {project.summary}
              </p>
            </section>

            <section className="border-t border-[var(--border-secondary)] pt-8">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)] mb-4">
                The Design Brief
              </h2>
              <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                {project.theBrief}
              </p>
            </section>

            <section className="border-t border-[var(--border-secondary)] pt-8">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)] mb-4">
                Artisanal Craftsmanship & Weaving Process
              </h2>
              <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                {project.craftsmanshipNarrative}
              </p>
            </section>

            <section className="border-t border-[var(--border-secondary)] pt-8">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)] mb-4">
                Architectural Outcome
              </h2>
              <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                {project.result}
              </p>
            </section>

            {/* Gallery Grid */}
            {project.gallery && project.gallery.length > 1 && (
              <section className="border-t border-[var(--border-secondary)] pt-8">
                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)] mb-6">
                  Installation Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.gallery.slice(1).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-64 md:h-80 rounded overflow-hidden border border-[var(--border-secondary)]"
                    >
                      <Image
                        src={img}
                        alt={`${project.title} detail ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Architectural Specifications */}
          <aside className="lg:col-span-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-secondary)] p-6 md:p-8 rounded-sm sticky top-32">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-primary)] mb-6 border-b border-[var(--border-secondary)] pb-3">
                <Layers size={16} className="text-[var(--accent-primary)]" />
                <span>Project Specifications</span>
              </div>

              <dl className="space-y-4 text-xs">
                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">Commission Type</dt>
                  <dd className="text-[var(--text-primary)] font-medium">{project.specs.clientType}</dd>
                </div>

                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">Location</dt>
                  <dd className="text-[var(--text-primary)] font-medium">{project.specs.location}</dd>
                </div>

                {project.specs.areaSqFt && (
                  <div>
                    <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">Floorplan Area</dt>
                    <dd className="text-[var(--text-primary)] font-medium">{project.specs.areaSqFt}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">Materials Sourced</dt>
                  <dd className="text-[var(--text-primary)] font-medium">
                    {project.specs.materials.join(" • ")}
                  </dd>
                </div>

                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">Weaving Techniques</dt>
                  <dd className="text-[var(--text-primary)] font-medium">
                    {project.specs.techniques.join(" • ")}
                  </dd>
                </div>

                {project.specs.leadTime && (
                  <div>
                    <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">Lead Time</dt>
                    <dd className="text-[var(--text-primary)] font-medium">{project.specs.leadTime}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-[var(--text-muted)] uppercase tracking-wider mb-1">Scope</dt>
                  <dd className="text-[var(--text-primary)] font-medium">{project.specs.scope}</dd>
                </div>
              </dl>

              {/* Partner Credits */}
              {project.partnerCredits && project.partnerCredits.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[var(--border-secondary)]">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--text-muted)] mb-3">
                    Collaborating Partners
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {project.partnerCredits.map((partner, idx) => (
                      <li key={idx} className="flex justify-between items-center text-[var(--text-secondary)]">
                        <div>
                          <span className="font-medium text-[var(--text-primary)]">{partner.name}</span>
                          <span className="block text-[10px] text-[var(--text-muted)]">{partner.role}</span>
                        </div>
                        {partner.url && (
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--accent-primary)] hover:underline flex items-center gap-0.5 text-[11px]"
                          >
                            <span>Profile</span>
                            <ArrowUpRight size={12} />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-[var(--border-secondary)]">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs uppercase tracking-widest font-semibold py-3 px-4 transition-colors"
                >
                  <span>Commission Project</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom CTA Banner */}
        <section className="w-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] p-8 md:p-12 text-center rounded-sm">
          <Sparkles className="mx-auto text-[var(--accent-primary)] mb-3" size={24} />
          <h2 className="font-sans font-light text-2xl md:text-3xl text-[var(--text-primary)] mb-3">
            Plan a Similar Architectural Installation
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
            Partner with House of Decór for custom residential mansions, boutique hospitality developments, and private aviation projects.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Request Studio Consultation
            </Link>
            <Link
              href="/designer-trade-program"
              className="px-6 py-3 border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Trade Program Benefits
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
