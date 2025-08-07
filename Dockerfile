# マルチステージビルド対応のDockerfile
ARG NODE_ENV=development

# ベースイメージ
FROM node:20-slim AS base
WORKDIR /app

# 依存関係のインストール
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 開発環境用ステージ
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ビルド用ステージ
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 本番環境用ステージ
FROM base AS prod
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY package.json ./
EXPOSE 3000
CMD ["npm", "start"]

# 環境変数に応じて最終ステージを決定
FROM ${NODE_ENV} AS final
