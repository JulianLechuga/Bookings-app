FROM node:20-alpine AS base

# Development image
FROM base AS development
WORKDIR /usr/src/app
# We will rely on volumes for package.json in dev, but let's copy it anyway just in case:
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production build
FROM base AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/server.js"]
