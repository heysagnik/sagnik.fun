import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/', destination: '/work', permanent: false },
      { source: '/resume', destination: '/Sagnik-Sahoo-AI-Engineer.pdf', permanent: false },
      { source: '/resume/ai', destination: '/Sagnik-Sahoo-AI-Engineer.pdf', permanent: false },
      { source: '/resume/ai-engineer', destination: '/Sagnik-Sahoo-AI-Engineer.pdf', permanent: false },
      { source: '/resume/sde', destination: '/Sagnik-Sahoo-SDE.pdf', permanent: false },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
};

export default nextConfig;
