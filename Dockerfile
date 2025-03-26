# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies and build
RUN npm install
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Copy package files and built code
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server/package*.json ./server/
COPY --from=builder /app/server/dist ./server/dist
COPY client/ ./client/

# Install production dependencies only
RUN npm ci --only=production && \
    cd server && \
    npm ci --only=production

# Expose port
EXPOSE 8000

# Start the server
CMD ["npm", "start"] 