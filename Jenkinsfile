pipeline {
    agent any  // Default agent to run the pipeline on any available Jenkins node
    
    stages {
        stage('Frontend Build') {
            agent {
                docker { image 'mern-frontend:latest' }
            }
            steps {
                echo 'Building frontend inside Docker container...'
            }
        }
        
        stage('Backend Build') {
            agent {
                docker { image 'ecommerce-backnd:latest' }
            }
            steps {
                echo 'Building backend inside Docker container...'
            }
        }
    }
}
