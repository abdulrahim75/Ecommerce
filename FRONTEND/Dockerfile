# --- STAGE 1: Build the React App ---
FROM node:18-alpine AS build
# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container.
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of your source code to the container
COPY . .

# Run the production build command
RUN npm run build

# --- STAGE 2: Serve with Nginx ---
# Use a lightweight Nginx image
FROM nginx:stable-alpine

# The 'npm run build' command in Vite creates a 'dist' folder.
# We copy the static files from that folder into the Nginx web server directory.
COPY --from=build /app/dist /usr/share/nginx/html

# Tell Docker that the container listens on port 80
EXPOSE 80

# The default command for the nginx image is to start the server.
# This line ensures it runs in the foreground.
CMD ["nginx", "-g", "daemon off;"]