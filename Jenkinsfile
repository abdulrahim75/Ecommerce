pipeline {
    agent any  // This defines that the pipeline will run on any available agent.
    
    stages {
        stage('Frontend Build') {
            agent {
                docker { image 'mern-frontend:latest' }
            }
            steps {
                echo 'Building the frontend inside Docker...'
            }
        }
        stage('Backend Build') {
            agent {
                docker { image 'ecommerce-backnd:latest' }
            }
            steps {
                echo 'Building the backend inside Docker...'
            }
        }
    }
}
