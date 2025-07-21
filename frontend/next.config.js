/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Remove appDir as it's now default in Next.js 14
  },
  images: {
    domains: ['localhost'],
  },
  // Remove env configuration that's causing warnings
}

module.exports = nextConfig 