# 1) Base image
FROM node:20-alpine

# 2) Create app directory
WORKDIR /app

# 3) Copy dependency files first (better caching)
COPY package*.json ./

# 4) Install dependencies
RUN npm ci --omit=dev

# 5) Copy source code
COPY . .

# 6) Expose the port your app uses
EXPOSE 3001

# 7) Start the service
CMD ["npm", "start"]