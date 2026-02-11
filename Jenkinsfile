pipeline {
    agent any

    environment {
        // CHANGE THIS to your actual Docker Hub username
        DOCKER_HUB_USER = 'sharath2003' 
        // Injects the Jenkins Build Number (e.g., 1, 2, 3) as the version
        VERSION = "${BUILD_NUMBER}"
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build & Tag Images') {
            steps {
                echo "Building version ${VERSION}..."
                sh "docker build -t ${DOCKER_HUB_USER}/cloud-native-frontend:${VERSION} ./frontend"
                sh "docker build -t ${DOCKER_HUB_USER}/cloud-native-backend:${VERSION} ./backend"
                sh "docker build -t ${DOCKER_HUB_USER}/cloud-native-nginx:${VERSION} ./nginx"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                // 'dockerhub-creds' must exist in Jenkins Credentials
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                    sh "echo \$PASS | docker login -u \$USER --password-stdin"
                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-frontend:${VERSION}"
                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-backend:${VERSION}"
                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-nginx:${VERSION}"
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo "Deploying Version ${VERSION} to EC2..."
                // Exporting variables so docker-compose can read them
                sh "export DOCKER_HUB_USER=${DOCKER_HUB_USER} && export VERSION=${VERSION} && docker compose up -d"
            }
        }

        stage('Verify Health') {
            steps {
                echo "Waiting for services to stabilize..."
                sleep 15
                sh "docker ps"
            }
        }
    }

    post {
        success {
            echo "Successfully deployed version ${VERSION}!"
        }
        failure {
            echo "Build or Deployment failed. Rolling back or checking logs is required."
        }
    }
}