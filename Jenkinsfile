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

                withDockerRegistry([credentialsId: DOCKERHUB_CREDENTIALS_ID, url: 'https://index.docker.io/v1/']) {
                    echo "Pushing Backend Image..."
                    docker.image("${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}").push()

                    echo "Pushing Frontend Image..."
                    docker.image("${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}").push()
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                sh 'echo "TODO: Update deployment YAMLs with new image tag and run kubectl apply"'
            }
        }
    }
}
