# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build (skip vue-tsc type checking in Docker)
COPY . .
RUN npx vite build

# ─── Stage 2: Serve with Nginx ───────────────────────────────
FROM nginx:alpine AS production

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
