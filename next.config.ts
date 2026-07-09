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
                hostname: "houseofdecor.ae",
            },
            {
                protocol: "https",
                hostname: "store.houseofdecor.ae",
            }
        ],
    },
};
export default nextConfig;