/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 開発環境でのみ型チェックを無効化
    ignoreBuildErrors: process.env.NODE_ENV !== 'production'
  },
  eslint: {
    // 開発環境でのみESLintチェックを無効化
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production'
  }
};

module.exports = nextConfig;
