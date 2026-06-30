import { NextRequest } from "next/server";

export async function getPosts() {
    try {
        const res = await fetch('/api/posts')
        if (!res.ok) {
            throw new Error("Failed to fetch posts");
        }
        const { posts } = await res.json()
        return posts;
    } catch (error) {
        return { error: "Failed to fetch posts" }
    }
} 