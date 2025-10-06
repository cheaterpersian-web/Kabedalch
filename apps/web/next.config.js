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
};

module.exports = nextConfig;
