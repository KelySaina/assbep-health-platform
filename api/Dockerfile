# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

# ─── Stage 2: Production ─────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install curl for healthcheck + openssl for Prisma
RUN apk add --no-cache curl openssl

# Copy package files and install all deps (need ts-node for seed)
COPY package.json package-lock.json ./
RUN npm ci

# Copy tsconfig for ts-node
COPY tsconfig.json ./

# Copy prisma schema and generate client for production
COPY prisma ./prisma
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh ./
# Strip CR before chmod: a CRLF shebang resolves to an interpreter named
# `/bin/sh\r`, and the container dies with "no such file or directory" —
# naming the script, which is present. .gitattributes should prevent it now;
# this makes the image correct even if a checkout somewhere does not.
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./docker-entrypoint.sh"]
