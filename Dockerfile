# ---------- Build stage (Node 16.20.2) ----------
FROM node:16.20.2 AS build
WORKDIR /app

# Ensure non-interactive + reproducible-ish builds
ENV CI=true
# Peer dep leniency (project needs this)
ENV NPM_CONFIG_LEGACY_PEER_DEPS=true

# Install deps (use lockfile if present; fall back to legacy peer deps)
COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm install --legacy-peer-deps --no-audit --no-fund

# Copy the rest of the source
COPY . .

# Build Angular in production mode
RUN npx ng build --configuration production

# ---------- Serve stage (Nginx) ----------
FROM nginx:1.25-alpine

# Nginx config: SPA fallback + basic caching (provided below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files to Nginx html root
COPY --from=build /app/dist/emancancode /usr/share/nginx/html

EXPOSE 80

# Keep Nginx in foreground so container stays up
CMD ["nginx", "-g", "daemon off;"]
