/** @type {import('next').NextConfig} */
const nextConfig = {
  // 開発環境のみの設定
  ...(process.env.NODE_ENV !== 'production' && {
    // 開発時は通常のNext.js設定
  }),
  // 本番環境（GitHub Pages）用の設定
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    distDir: 'out',
    trailingSlash: true,
    basePath: '/my-memo',
    images: {
      unoptimized: true
    },
  }),
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV !== 'production'
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production'
  }
};

module.exports = nextConfig;
