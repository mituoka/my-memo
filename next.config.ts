import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  typescript: {
    // 開発環境でのみ型チェックを無効化
    ignoreBuildErrors: isDev
  },
  eslint: {
    // 開発環境でのみESLintチェックを無効化
    ignoreDuringBuilds: isDev
  }
};

export default nextConfig;
