import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    /* config options here */
    images: {
        qualities: [75, 85],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "mediumslateblue-grasshopper-769837.hostingersite.com",
            },
        ],
    },
};
export default nextConfig;