"use client";

const testimonials = [
  {
    quote: "Our clients were impressed by the craftsmanship, communication and attention to detail throughout the project.",
    author: "INTERIOR DESIGNER",
  },
  {
    quote: "The bespoke rug became the defining feature of our hospitality space.",
    author: "HOTEL PROCUREMENT MANAGER",
  },
  {
    quote: "A seamless experience from concept to installation. The quality and artistry are unmatched.",
    author: "ARCHITECT",
  },
];

export default function ProjectsTestimonials() {
  return (
    <section className="w-full py-8 md:py-12 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">
          {testimonials.map((test, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <span className="text-3xl text-[var(--text-secondary)] font-serif mb-2">“</span>
              <p className="text-sm md:text-base font-light italic text-[var(--text-primary)] leading-relaxed mb-3">
                {test.quote}
              </p>
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
                {test.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
