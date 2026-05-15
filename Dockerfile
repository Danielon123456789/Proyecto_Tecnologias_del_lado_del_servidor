FROM node:20-slim

# Install system dependencies for MongoDB and process management
RUN apt-get update && \
    apt-get install -y libcurl4 procps && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
