FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy server files
COPY server/src ./src

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "src/index.js"]
