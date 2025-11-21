# terraform/variables.tf

variable "frontend_port" {
  description = "The external port for the frontend container"
  type        = number
  default     = 3000
}

variable "backend_port" {
  description = "The external port for the backend container"
  type        = number
  default     = 5000
}

variable "grafana_port" {
  description = "The external port for the Grafana container"
  type        = number
  default     = 3001
}