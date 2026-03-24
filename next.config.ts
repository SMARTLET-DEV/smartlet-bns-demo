import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "smartlet-docs-dev.s3.ap-southeast-2.amazonaws.com",
            },
        ], // Add the hostname here
    },
};

export default nextConfig;
