# Cтадия 1: Сборка
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Стадия 2: Продакшн
FROM node:lts-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

RUN npm install -g serve@14.2.4

COPY --from=builder --chown=node:node /app/dist ./dist
USER node

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]