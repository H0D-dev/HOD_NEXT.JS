import { API_CONFIG } from "@/src/lib/api/api";
import { BASE_URL } from "@/src/lib/seo/schema";

export const revalidate = 3600;

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: any[] = [];

  try {
    const wpUrl = `${API_CONFIG.baseUrl}/wp-json/wp/v2/posts?_embed&per_page=50`;
    const res = await fetch(wpUrl, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        posts = data;
      }
    }
  } catch (error) {
    console.warn("Error fetching posts for RSS feed, using static entries:", error);
  }

  const staticGuides = [
    {
      title: "Handmade vs Machine Rugs Buying Guide",
      slug: "know-your-rug/rug-guide",
      excerpt: "Discover the art of rug selection. Learn about handmade vs machine-made rugs, lighting conditions, and quick facts.",
      date: new Date().toUTCString(),
    },
    {
      title: "Artisanal Rug Making Process: 18 Steps of Handcrafted Luxury",
      slug: "know-your-rug/rug-making-process",
      excerpt: "Transforming raw fibers into masterpieces. Explore the 18 steps of spinning, dyeing, knotting, and finishing.",
      date: new Date().toUTCString(),
    },
    {
      title: "Rug Care, Cleaning & Maintenance Guide",
      slug: "care-cleaning",
      excerpt: "Expert guide on preserving handmade silk and wool rugs with professional stain removal techniques.",
      date: new Date().toUTCString(),
    },
    {
      title: "Rug Size & Placement Guide for Living Rooms and Bedrooms",
      slug: "size-fitting-guide",
      excerpt: "Interactive size and placement guide for living rooms, dining spaces, and bedrooms to find your ideal rug dimensions.",
      date: new Date().toUTCString(),
    },
  ];

  const buildDate = new Date().toUTCString();

  const postItems = posts
    .map((post) => {
      const title = post.title?.rendered || "House of Decór Journal";
      const link = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : buildDate;
      const description = post.excerpt?.rendered
        ? post.excerpt.rendered.replace(/<[^>]+>/g, "").trim()
        : title;

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">House of Decór</dc:creator>
    </item>`;
    })
    .join("\n");

  const guideItems = staticGuides
    .map((g) => {
      const link = `${BASE_URL}/${g.slug}`;
      return `    <item>
      <title>${escapeXml(g.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(g.excerpt)}</description>
      <pubDate>${g.date}</pubDate>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">House of Decór Editorial Team</dc:creator>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>House of Decór — Luxury Rugs, Bespoke Drapery &amp; Interior Insights</title>
    <link>${BASE_URL}</link>
    <description>Latest design stories, buying guides, artisanal craftsmanship features, and interior case studies from House of Decór Dubai.</description>
    <language>en-ae</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/logo/new_logo_footer.png</url>
      <title>House of Decór</title>
      <link>${BASE_URL}</link>
    </image>
${postItems}
${guideItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
