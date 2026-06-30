import { API_CONFIG } from "@/src/lib/api/api"

export async function getPosts() {
    try {
        const URL = `${API_CONFIG.baseUrl}/wp-json/wp/v2/posts?_embed`;
        
        const res = await fetch(URL, {
            cache: "no-store",
        });
        
        const rawPosts = await res.json();
        
        if (!Array.isArray(rawPosts)) {
             return rawPosts; // might be an error object from WP
        }

        const posts = rawPosts.map(post => {
            const featuredMedia = post._embedded && post._embedded['wp:featuredmedia'] ? post._embedded['wp:featuredmedia'][0] : null;
            const imageUrl = featuredMedia ? featuredMedia.source_url : '/rugs/set1-room.png';

            return {
                id: post.id,
                slug: post.slug,
                title: post.title.rendered,
                excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
                date: new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                image: imageUrl,
                content: post.content.rendered,
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