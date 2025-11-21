# terraform/main.tf

# 1. Create a custom Docker network for our containers to communicate
resource "docker_network" "ecommerce_network" {
  name = "ecommerce-network"
}

# 2. Add a MongoDB database container (since you're using MERN)
resource "docker_container" "mongo_db" {
  name  = "mongo-db"
  image = "mongo:latest"
  networks_advanced {
    name = docker_network.ecommerce_network.name
  }
}

# 3. Build and run your Backend container
# First, build the Docker image from your backend's Dockerfile
resource "docker_image" "backend_image" {
  name         = "ecommerce-backend:latest"
  build {
    context    = "../backnd" # Path to your backend folder
    dockerfile = "dockerfile"
  }
}

# Then, create a container from that image
resource "docker_container" "backend_container" {
  name  = "ecommerce-backend-container"
  image = docker_image.backend_image.name
  ports {
    internal = 9000 # The port your Node.js app listens on inside the container
    external = var.backend_port # The port you access from your browser
  }
  networks_advanced {
    name = docker_network.ecommerce_network.name
  }
  # This tells Terraform to start the MongoDB container before this one
  depends_on = [docker_container.mongo_db]
}

# 4. Build and run your Frontend container
# First, build the image from your frontend's Dockerfile
resource "docker_image" "frontend_image" {
  name         = "ecommerce-frontend:latest"
  build {
    context    = "../FRONTEND" # Path to your frontend folder
    dockerfile = "Dockerfile"
  }
}

# Then, create the container
resource "docker_container" "frontend_container" {
  name  = "ecommerce-frontend-container"
  image = docker_image.frontend_image.name
  ports {
    internal = 3000 # The port Vite/React dev server runs on inside the container
    external = var.frontend_port # The port you access from your browser
  }
  networks_advanced {
    name = docker_network.ecommerce_network.name
  }
}

# Ecommerce/terraform/main.tf

# 5. Add the Prometheus container for monitoring
resource "docker_container" "prometheus" {
  name  = "prometheus-container"
  image = "prom/prometheus:latest"
  ports {
    internal = 9090
    external = 9090
  }
  # This mounts your config file from your computer into the container
  volumes {
    # This now correctly uses an absolute path
    host_path      = abspath("${path.module}/../prometheus/prometheus.yml")
    container_path = "/etc/prometheus/prometheus.yml"
    read_only      = true
  }
  networks_advanced {
    name = docker_network.ecommerce_network.name
  }
  # This ensures the backend starts before Prometheus does
  depends_on = [docker_container.backend_container]
}

# 6. Add the Grafana container for visualization
resource "docker_container" "grafana" {
  name  = "grafana-container"
  image = "grafana/grafana:latest"
  ports {
    internal = 3000
    external = var.grafana_port
  }
  networks_advanced {
    name = docker_network.ecommerce_network.name
  }
}