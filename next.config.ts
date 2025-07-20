import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'media.licdn.com',  // Add this line
    ],
  },
};

export default nextConfig;
