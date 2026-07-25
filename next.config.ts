import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ['192.168.31.240'],
    images: {
        unoptimized: true,
        qualities: [75, 85],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            }
        ],
    },
};
export default nextConfig;