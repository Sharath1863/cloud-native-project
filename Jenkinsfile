pipeline {
    agent any

    environment {
        // This ensures the build runs with the correct user permissions
        DOCKER_COMPOSE = 'docker compose'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically clones your repo here
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Cleaning up old containers to save space...'
                // This stops and removes old containers before building new ones
                sh "${DOCKER_COMPOSE} down --remove-orphans"
            }
        }

        stage('Build & Deploy') {
            steps {
                echo 'Building and starting containers...'
                // The -d flag runs it in the background
                // The --build flag ensures your App.js changes are included
                sh "${DOCKER_COMPOSE} up -d --build"
            }
        }

        stage('Verify') {
            steps {
                echo 'Verifying deployment...'
                // Gives the containers 10 seconds to start up
                sleep 10
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful! Visit http://44.221.51.56'
        }
        failure {
            echo 'Deployment Failed. Check the logs above.'
        }
    }
}