# 1. Base Image
# Use full image for build stages to ensure native dependencies (Python/Make/GCC) work
FROM node:22 AS base
WORKDIR /app

# 2. Dependencies Stage
FROM base AS deps
# Copy only package files first to leverage caching
COPY package.json package-lock.json ./

# Install dependencies
# --mount=type=cache speeds up builds by caching the npm store locally
# 'npm ci' ensures strict adherence to package-lock.json
RUN npm ci --only=production

# 3. Build Stage
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run the build (output goes to .output)
# Note: Do NOT pass secrets (AWS keys) here. 
# Nuxt RuntimeConfig should read them from the environment at runtime.
RUN npm run build

# 4. Production Stage
# Use slim image for the final container to reduce size
FROM node:22-slim AS production

# Set production environment
ENV NODE_ENV=production

# Security: Run as a non-root user (standard 'node' user)
USER node
WORKDIR /app

# Copy ONLY the compiled output
# Nuxt bundles necessary dependencies into .output, so we don't need node_modules here
COPY --from=build /app/.output /app/.output

# Networking configuration
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]