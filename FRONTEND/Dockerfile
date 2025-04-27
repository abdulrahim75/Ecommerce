# Frontend Dockerfile
FROM node:18.9.1

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run frontend dev server
CMD ["npm", "run", "dev"]
