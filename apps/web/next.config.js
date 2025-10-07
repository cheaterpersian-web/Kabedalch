/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: require('./next-i18next.config').i18n,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env.API_INTERNAL_URL || 'http://api:3001',
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
      ],
    },
  },
};

module.exports = nextConfig;
