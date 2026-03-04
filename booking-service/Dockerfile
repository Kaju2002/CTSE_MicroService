# Use official Node.js LTS Alpine image for smaller size and security
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (default 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
