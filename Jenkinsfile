pipeline {
    agent any

    tools {
        nodejs "nodejs16"
    }

    environment {
        DOCKER_BUILDKIT = 1
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/abdulrahim75/Ecommerce.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('BACKND') {
                    sh 'npm install'
                }
                dir('FRONTEND') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('FRONTEND') {
                    sh 'npm run build'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('BACKND') {
                    sh 'npm test || true'  // if you have tests set up
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                sh 'docker build -t rahimxp/ecommerce-backend:latest ./BACKND'
                sh 'docker build -t rahimxp/ecommerce-frontend:latest ./FRONTEND'
                sh 'docker push rahimxp/ecommerce-backend:latest'
                sh 'docker push rahimxp/ecommerce-frontend:latest'
            }
        }

        stage('Deploy to Vercel or Server') {
            steps {
                dir('FRONTEND') {
                    sh 'vercel --prod --confirm'
                }
            }
        }
    }
}
