// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = 'your-dockerhub-credentials-id'
        DOCKERHUB_USERNAME = 'rahimxp'
        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo "Building Backend Image: ${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}"
                script {
                    docker.build("${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}", '-f backnd/dockerfile ./backnd')
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo "Building Frontend Image: ${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}"
                script {
                    docker.build("${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}", '-f FRONTEND/Dockerfile ./FRONTEND')
                }
            }
        }

        stage('Push Images') {
            steps {
                echo "Logging into Docker Hub..."

                script {
                    withDockerRegistry([credentialsId: DOCKERHUB_CREDENTIALS_ID, url: 'https://index.docker.io/v1/']) {

                        echo "Pushing Backend Image..."
                        docker.image("${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}").push()

                        echo "Pushing Frontend Image..."
                        docker.image("${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}").push()
                    }
                }
            }
        }


        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                bat 'echo "TODO: Update deployment YAMLs with new image tag and run kubectl apply"'
            }
        }
    }
}
