# terraform/providers.tf

# This block tells Terraform which providers we need to download and use.
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

# This block configures the Docker provider itself.
# It will automatically connect to your local Docker daemon.
provider "docker" {}