# Build stage
FROM node:18.19.1-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependenciesz
RUN rm -rf node_modules package-lock.json && \
    npm install && \
    cd client && rm -rf node_modules package-lock.json && npm install && \
    cd ../server && rm -rf node_modules package-lock.json && npm install

# Copy source code
COPY . .

# Build client and server
RUN npm run build

# Production stage
FROM node:18.19.1-slim

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server/package*.json ./server/

# Install production dependencies only
RUN npm install --omit=dev && \
    cd server && \
    npm install --omit=dev

# Expose port
EXPOSE 8000

# Start the server
CMD ["npm", "start"] 