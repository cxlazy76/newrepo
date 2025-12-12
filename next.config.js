/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configurations
  async rewrites() {
    return [
      {
        source: '/stream/:path*',
        destination: '/api/video/stream/:path*',
      },
      // You may need to adjust the source to be more specific if you don't use :path*
      // For this specific case:
      {
        source: '/stream',
        destination: '/api/video/stream',
      },
      // If you want to support /stream?id=... and /stream/download?id=...:
      // {
      //   source: '/stream/:slug*',
      //   destination: '/api/video/stream/:slug*',
      // },
      
      // The most robust rewrite for the request:
      {
        source: '/stream',
        destination: '/api/video/stream',
      },
    ];
  },
};

module.exports = nextConfig;