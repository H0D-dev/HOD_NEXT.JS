import { NextResponse } from "next/server";
import { getPosts } from "@/src/services/Posts";

export async function GET(request) {
    try {
        const posts = await getPosts();
        
        if (!Array.isArray(posts)) {
             return NextResponse.json({ posts: posts }); // could be an error object
        }

        return NextResponse.json({ posts })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
