import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/kettlebell-workout',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
