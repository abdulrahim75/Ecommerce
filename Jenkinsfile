// pipeline {
//     agent any

//     tools {
//         nodejs "nodejs16"
//     }

//     environment {
//         DOCKER_BUILDKIT = 1
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 git 'https://github.com/abdulrahim75/Ecommerce.git'
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 dir('BACKND') {
//                     sh 'npm install'
//                 }
//                 dir('FRONTEND') {
//                     sh 'npm install'
//                 }
//             }
//         }

//         stage('Build Frontend') {
//             steps {
//                 dir('FRONTEND') {
//                     sh 'npm run build'
//                 }
//             }
//         }

//         stage('Run Backend Tests') {
//             steps {
//                 dir('BACKND') {
//                     sh 'npm test || true'  // if you have tests set up
//                 }
//             }
//         }

//         stage('Docker Build & Push') {
//             steps {
//                 sh 'docker build -t rahimxp/ecommerce-backend:latest ./BACKND'
//                 sh 'docker build -t rahimxp/ecommerce-frontend:latest ./FRONTEND'
//                 sh 'docker push rahimxp/ecommerce-backend:latest'
//                 sh 'docker push rahimxp/ecommerce-frontend:latest'
//             }
//         }

//         stage('Deploy to Vercel or Server') {
//             steps {
//                 dir('FRONTEND') {
//                     sh 'vercel --prod --confirm'
//                 }
//             }
//         }
//     }
// }


// Jenkinsfile
pipeline {
    // Agent 'any' means Jenkins can use any available machine to run this pipeline.
    agent any

    // Environment variables used throughout the pipeline
    environment {
        // Your Docker Hub username. Jenkins will need credentials configured.
        DOCKERHUB_CREDENTIALS_ID = 'your-dockerhub-credentials-id'
        DOCKERHUB_USERNAME = 'rahimxp'
        // We'll use the build number to version our Docker images
        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
    }

    // The stages of our deployment process
    stages {
        // Stage 1: Get the latest code from your repository
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                // This step automatically checks out your Git repository
                checkout scm
            }
        }
        

        // Stage 2: Build the backend Docker image
        stage('Build Backend') {
            steps {
                echo "Building Backend Image: ${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}"
                // Runs the docker build command from the 'backnd' directory
                script {
                    docker.build("${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}", '-f backnd/dockerfile ./backnd')
                }
            }
        }

        // Stage 3: Build the frontend Docker image
        stage('Build Frontend') {
            steps {
                echo "Building Frontend Image: ${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}"
                // Runs the docker build command from the 'FRONTEND' directory
                script {
                    docker.build("${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}", '-f FRONTEND/Dockerfile ./FRONTEND')
                }
            }
        }

        // Stage 4: Push both images to Docker Hub
        stage('Push Images') {
            steps {
                // Jenkins needs Docker Hub credentials configured to do this
                withDockerRegistry(credentialsId: DOCKERHUB_CREDENTIALS_ID) {
                    echo "Pushing Backend Image..."
                    docker.image("${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}").push()

                    echo "Pushing Frontend Image..."
                    docker.image("${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}").push()
                }
            }
        }

        // Stage 5: Deploy the new images to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                // We would first need to update our YAML files to use the new IMAGE_TAG
                // Then apply the changes. This is an advanced step.
                // For now, we just show the command.
                // kubectl apply -f k8s/
                sh 'echo "TODO: Update deployment YAMLs with new image tag and run kubectl apply"'
            }
        }
    }
}
