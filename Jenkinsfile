// // Jenkinsfile
// pipeline {
//     agent any

//     environment {
//         DOCKERHUB_CREDENTIALS_ID = 'your-dockerhub-credentials-id'
//         DOCKERHUB_USERNAME = 'rahimxp'
//         IMAGE_TAG = "build-${env.BUILD_NUMBER}"
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 echo 'Checking out code...'
//                 checkout scm
//             }
//         }

//         stage('Build Backend') {
//             steps {
//                 echo "Building Backend Image: ${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}"
//                 script {
//                     docker.build("${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}", '-f backnd/dockerfile ./backnd')
//                 }
//             }
//         }

//         stage('Build Frontend') {
//             steps {
//                 echo "Building Frontend Image: ${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}"
//                 script {
//                     docker.build("${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}", '-f FRONTEND/Dockerfile ./FRONTEND')
//                 }
//             }
//         }

//         stage('Push Images') {
//             steps {
//                 echo "Logging into Docker Hub..."

//                 script {
//                     withDockerRegistry([credentialsId: DOCKERHUB_CREDENTIALS_ID, url: 'https://index.docker.io/v1/']) {

//                         echo "Pushing Backend Image..."
//                         docker.image("${DOCKERHUB_USERNAME}/ecommerce-backend:${IMAGE_TAG}").push()

//                         echo "Pushing Frontend Image..."
//                         docker.image("${DOCKERHUB_USERNAME}/ecommerce-frontend:${IMAGE_TAG}").push()
//                     }
//                 }
//             }
//         }


//         stage('Deploy to Kubernetes') {
//             steps {
//                 echo 'Deploying to Kubernetes...'
//                 bat 'echo "TODO: Update deployment YAMLs with new image tag and run kubectl apply"'
//             }
//         }
//     }
// }

pipeline {
    agent any

    environment {
        // Kubernetes Setup
        KUBECONFIG_PATH = 'k8s/kubeconfig' // Assume you have a KUBECONFIG file available or use a Kubernetes plugin
        
        // Docker Hub Setup
        DOCKERHUB_CREDENTIALS_ID = 'your-dockerhub-credentials-id'
        DOCKERHUB_USERNAME = 'rahimxp'
        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
        
        // Blue/Green Variables (These will be dynamically set)
        CURRENT_ACTIVE_COLOR = '' 
        TARGET_STAGING_COLOR = ''
        
        // NOTE: Make sure the image tag in your k8s/backend-blue.yml and backend-green.yml 
        // is a variable placeholder or is updated dynamically (we'll do dynamic in the script below)
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        // Build & Push stages (Backend & Frontend)
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

        // Blue/Green Deployment
        stage('Blue/Green Deployment') {
            steps {
                script {
                    // Define components to deploy (both backend and frontend)
                    def components = ['backend', 'frontend']
                    
                    // --- 1. Determine which color is ACTIVE ---
                    echo 'Determining current active environment (Blue or Green)...'
                    
                    // We only need to check one Service (e.g., backend) to determine the current color
                    def activeServiceSelector = sh(
                        script: "kubectl get svc backend-service -o jsonpath='{.spec.selector.traffic}'",
                        returnStdout: true
                    ).trim()

                    if (activeServiceSelector == 'active') {
                        env.CURRENT_ACTIVE_COLOR = 'blue'
                        env.TARGET_STAGING_COLOR = 'green'
                    } else {
                        env.CURRENT_ACTIVE_COLOR = 'green'
                        env.TARGET_STAGING_COLOR = 'blue'
                    }

                    echo "Current Active: ${CURRENT_ACTIVE_COLOR}. Deploying to Staging: ${TARGET_STAGING_COLOR}."
                    
                    // --- 2. Update and Deploy Staging Environment (Backend & Frontend) ---
                    components.each { component ->
                        def imageRepo = "${DOCKERHUB_USERNAME}/ecommerce-${component}"
                        echo "Updating ${TARGET_STAGING_COLOR} ${component} deployment with new image tag: ${IMAGE_TAG}"
                        
                        // Patch the Staging Deployment to use the new image tag
                        sh """
                            kubectl set image deployment/${component}-${TARGET_STAGING_COLOR} ${component}=${imageRepo}:${IMAGE_TAG}
                        """
                        
                        // Wait for the Staging Deployment to be ready
                        echo "Waiting for ${TARGET_STAGING_COLOR} ${component} deployment rollout to complete..."
                        sh "kubectl rollout status deployment/${component}-${TARGET_STAGING_COLOR} --timeout=10m"
                    }

                    // --- 3. Validation/Testing Pause ---
                    timeout(time: 60, unit: 'MINUTES') {
                        input message: "NEW ${TARGET_STAGING_COLOR} DEPLOYMENTS (Backend & Frontend) are READY. Test thoroughly before switching traffic. Proceed with switch?", ok: 'Proceed'
                    }

                    // --- 4. Traffic Switch (ZERO-DOWNTIME SWITCHOVER) ---
                    echo "SWITCHING TRAFFIC from ${CURRENT_ACTIVE_COLOR} to ${TARGET_STAGING_COLOR} for all components!"
                    
                    components.each { component ->
                        // 4a. Update the Staging Pods label to 'traffic: active'
                        sh """
                            kubectl label deployment ${component}-${TARGET_STAGING_COLOR} traffic=active --overwrite=true
                        """
                        // 4b. Remove the 'traffic: active' label from the Old (now inactive) Deployment
                        sh """
                            kubectl label deployment ${component}-${CURRENT_ACTIVE_COLOR} traffic=staging --overwrite=true
                        """
                    }
                    
                    echo "Traffic Switch Complete. ${TARGET_STAGING_COLOR} is now LIVE for all components."

                    // --- 5. Scale Down Old Environment ---
                    echo "Scaling down old ${CURRENT_ACTIVE_COLOR} deployments..."
                    components.each { component ->
                        sh "kubectl scale deployment ${component}-${CURRENT_ACTIVE_COLOR} --replicas=0"
                    }
                    
                    echo "Deployment completed successfully. New version: ${IMAGE_TAG}"
                }
            }
        }
    }
}
