pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'sharath2003'
        VERSION = "${BUILD_NUMBER}"
        K8S_NAMESPACE = "cloud-native"
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
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    passwordVariable: 'PASS',
                    usernameVariable: 'USER'
                )]) {

                    sh "echo \$PASS | docker login -u \$USER --password-stdin"

                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-frontend:${VERSION}"
                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-backend:${VERSION}"
                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-nginx:${VERSION}"
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                echo "Updating image tags in K8s manifests..."

                sh """
                sed -i 's|cloud-native-frontend:.*|cloud-native-frontend:${VERSION}|g' k8s/frontend-deployment.yaml
                sed -i 's|cloud-native-backend:.*|cloud-native-backend:${VERSION}|g' k8s/backend-deployment.yaml
                sed -i 's|cloud-native-nginx:.*|cloud-native-nginx:${VERSION}|g' k8s/nginx-deployment.yaml
                """
            }
        }

        stage('Deploy to EKS') {
            steps {
                echo "Deploying to Kubernetes cluster..."

                sh "kubectl apply -f k8s/"

                sh "kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE}"
                sh "kubectl rollout status deployment/backend -n ${K8S_NAMESPACE}"
            }
        }

        stage('Verify Pods') {
            steps {
                sh "kubectl get pods -n ${K8S_NAMESPACE}"
            }
        }
    }

    post {
        success {
            echo "Successfully deployed version ${VERSION} to EKS 🚀"
        }
        failure {
            echo "Deployment failed. Check logs."
        }
    }
}
