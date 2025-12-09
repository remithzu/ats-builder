# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

COPY . .
RUN npm run build


# --- Production Stage ---
FROM fholzer/nginx-brotli:latest

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
