const withNextIntl = require('next-intl/plugin')();
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@reclamtrack/shared'],
  // ... (rest of the config)
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'placeholder.pics' },
    ],
  },
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return [
        { source: '/debug/:path*', destination: `${backendUrl}/debug/:path*` },
        { source: '/analytics/:path*', destination: `${backendUrl}/analytics/:path*` },
        { source: '/uploads/:path*', destination: `${backendUrl}/uploads/:path*` },
      ];
    },
  }),
};

module.exports = withPWA(withNextIntl(nextConfig));

