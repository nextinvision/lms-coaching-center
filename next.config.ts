import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Explicitly set the root directory to fix workspace detection
  experimental: {
    turbo: {
      root: path.resolve(__dirname),
    },
  },
}

export default nextConfig
