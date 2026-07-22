import { API_CONFIG } from "@/src/lib/api/api"

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
    return '/products_hero.png';
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

export async function getPosts() {
    try {
        const URL = `${API_CONFIG.baseUrl}/wp-json/wp/v2/posts?_embed`;
        
        const res = await fetch(URL, {
            next: { revalidate: 60 },
        });
        
        const rawPosts = await res.json();
        
        if (!Array.isArray(rawPosts)) {
             return rawPosts; // might be an error object from WP
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
                image: imageUrl,
                content: cleanedContent,
                sections: []
            };
        });

        return posts;
    } catch (error) {
        console.log(error)
        return { error: "Failed to fetch posts" }
    }
} 

export async function getPostBySlug(slug) {
    try {
        const posts = await getPosts();
        if (posts.error || !Array.isArray(posts)) return null;
        return posts.find(post => post.slug.toLowerCase() === slug?.toLowerCase());
    } catch (error) {
        return null;
    }
}