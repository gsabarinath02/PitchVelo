/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress warnings for better UX
  reactStrictMode: false,
  swcMinify: true,
  
  // Optimize for smooth experience
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Suppress console warnings in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig 