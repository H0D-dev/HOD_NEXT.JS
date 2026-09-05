import { cache } from "react";
import { API_CONFIG } from "@/src/lib/api/api";

function getPostImageUrl(post) {
    // 1. Check embedded WP Featured Media
    if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        const media = post._embedded['wp:featuredmedia'][0];
        if (media.source_url) return media.source_url;
        if (media.media_details?.sizes?.full?.source_url) return media.media_details.sizes.full.source_url;
        if (media.media_details?.sizes?.large?.source_url) return media.media_details.sizes.large.source_url;
    }

    // 2. Check Jetpack Featured Media URL
    if (post.jetpack_featured_media_url) {
        return post.jetpack_featured_media_url;
    }

    // 3. Take the first image inside post content as the featured/cover image
    if (post.content && post.content.rendered) {
        const match = post.content.rendered.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) {
            let src = match[1];
            if (src.startsWith('//')) {
                src = 'https:' + src;
            }
            return src;
        }
    }

    // 4. Default fallback placeholder image
    return '/products_hero.webp';
}

function decodeHtmlEntities(text) {
    if (!text) return '';
    return text.replace(/&([^;]+);/g, (match, entity) => {
        const entities = {
            'amp': '&',
            'lt': '<',
            'gt': '>',
            'quot': '"',
            '#039': "'",
            '#39': "'",
            '#8211': '–',
            '#8212': '—',
            '#8216': '‘',
            '#8217': '’',
            '#8220': '“',
            '#8221': '”',
            '#8230': '…',
            'hellip': '…',
            'nbsp': ' ',
            '#038': '&',
            '#38': '&'
        };
        return entities[entity] || match;
    });
}

export const getPosts = cache(async () => {
    try {
        const baseUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
        const URL = `${baseUrl}/wp-json/wp/v2/posts?_embed&per_page=20`;
        
        const res = await fetch(URL, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000)
        });

        if (!res.ok) {
            console.warn(`[WordPress API] HTTP ${res.status} for /wp/v2/posts (${baseUrl})`);
            return [];
        }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn(`[WordPress API] Non-JSON response for /wp/v2/posts: ${contentType}`);
            return [];
        }
        
        const rawPosts = await res.json();
        
        if (!Array.isArray(rawPosts)) {
             return [];
        }

        const posts = rawPosts.map(post => {
            const imageUrl = getPostImageUrl(post);
            const rawContent = post.content?.rendered || '';
            const cleanedContent = rawContent;
            const rawExcerpt = post.excerpt?.rendered || '';
            let cleanExcerpt = decodeHtmlEntities(rawExcerpt.replace(/<[^>]+>/g, '').trim());
            cleanExcerpt = cleanExcerpt.replace(/\[…\]/g, '...');
            const title = decodeHtmlEntities(post.title?.rendered || '');

            return {
                id: post.id,
                slug: post.slug,
                title: title,
                excerpt: cleanExcerpt,
                date: new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                modified: post.modified,
                image: imageUrl,
                content: cleanedContent,
                sections: []
            };
        });

        return posts;
    } catch (error) {
        if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
            console.warn("[WordPress API] Connection timed out for /wp/v2/posts. Using fallback.");
        } else {
            console.warn("[WordPress API] Fetch failed for /wp/v2/posts:", error?.message || error);
        }
        return [];
    }
}); 

export const getPostBySlug = cache(async (slug) => {
    try {
        if (!slug) return null;
        const baseUrl = API_CONFIG.baseUrl || "https://store.houseofdecor.ae";
        const URL = `${baseUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`;
        const res = await fetch(URL, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) {
            console.warn(`[WordPress API] HTTP ${res.status} for slug: ${slug} (${baseUrl})`);
            return null;
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            console.warn(`[WordPress API] Non-JSON response for slug: ${slug}: ${contentType}`);
            return null;
        }
        const rawPosts = await res.json();
        if (!Array.isArray(rawPosts) || rawPosts.length === 0) return null;

        const post = rawPosts[0];
        const imageUrl = getPostImageUrl(post);
        const rawContent = post.content?.rendered || '';
        const rawExcerpt = post.excerpt?.rendered || '';
        let cleanExcerpt = decodeHtmlEntities(rawExcerpt.replace(/<[^>]+>/g, '').trim());
        cleanExcerpt = cleanExcerpt.replace(/\[…\]/g, '...');
        const title = decodeHtmlEntities(post.title?.rendered || '');

        return {
            id: post.id,
            slug: post.slug,
            title: title,
            excerpt: cleanExcerpt,
            date: new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            modified: post.modified,
            image: imageUrl,
            content: rawContent,
            sections: []
        };
    } catch (error) {
        if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
            console.warn(`[WordPress API] Connection timed out for slug: ${slug}`);
        } else {
            console.warn(`[WordPress API] Fetch failed for slug ${slug}:`, error?.message || error);
        }
        return null;
    }
});