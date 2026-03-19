/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Capacitor APK
  // output: 'export',  // Enable this when building APK
  
  images: {
    // For static export, use unoptimized
    // unoptimized: true,  // Enable this when building APK
    remotePatterns: [],
  },

  // Headers for PWA
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
