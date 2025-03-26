# Use Node.js v18
FROM node:18-slim

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/ ./client/

# Install dependencies
RUN npm install

# Copy server source code
COPY server/ ./server/

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8000

# Start the server
CMD ["npm", "start"] 