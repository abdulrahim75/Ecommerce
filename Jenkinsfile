pipeline {
    stages {
        stage('Frontend Build') {
            agent {
                docker { image 'mern-frontend:latest' }
            }
            steps {
                echo 'Building the frontend...'
            }
        }
        stage('Backend Build') {
            agent {
                docker { image 'ecommerce-backnd:latest' }
            }
            steps {
                echo 'Building the backend...'
            }
        }
    }
}
