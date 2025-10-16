// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/TaskPals',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;