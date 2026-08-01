import type { NextConfig } from "next";
const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ['192.168.31.240'],
    images: {
        unoptimized: false,
        formats: ['image/avif', 'image/webp'],
        qualities: [75, 85],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "store.houseofdecor.ae",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/terms-of-service',
                destination: '/terms-conditions',
                permanent: true,
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ]
            }
        ];
    }
};
export default nextConfig;