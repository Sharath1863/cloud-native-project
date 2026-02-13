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

        // ---------------- BUILD ----------------
        stage('Build & Tag Images') {
            steps {
                echo "Building version ${VERSION}..."

                sh "docker build -t ${DOCKER_HUB_USER}/cloud-native-frontend:${VERSION} ./frontend"
                sh "docker build -t ${DOCKER_HUB_USER}/cloud-native-backend:${VERSION} ./backend"
            }
        }

        // ---------------- PUSH ----------------
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {

                    sh "echo \$PASS | docker login -u \$USER --password-stdin"

                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-frontend:${VERSION}"
                    sh "docker push ${DOCKER_HUB_USER}/cloud-native-backend:${VERSION}"
                }
            }
        }

        // ---------------- UPDATE MANIFESTS ----------------
        stage('Update Kubernetes Manifests') {
            steps {
                echo "Updating image tags in K8s manifests..."

                sh """
                sed -i 's|cloud-native-frontend:.*|cloud-native-frontend:${VERSION}|g' k8s/frontend-deployment.yaml
                sed -i 's|cloud-native-backend:.*|cloud-native-backend:${VERSION}|g' k8s/backend-deployment.yaml
                """
            }
        }

        // ---------------- DEPLOY ----------------
        stage('Deploy to EKS') {
            steps {
                echo "Deploying to Kubernetes cluster..."

                sh "kubectl apply -f k8s/"

                sh "kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE}"
                sh "kubectl rollout status deployment/backend -n ${K8S_NAMESPACE}"
            }
        }

        // ---------------- VERIFY ----------------
        stage('Verify Deployment') {
            steps {
                sh "kubectl get pods -n ${K8S_NAMESPACE}"
                sh "kubectl get svc -n ${K8S_NAMESPACE}"
            }
        }
    }

    // ---------------- POST ----------------
    post {
        success {
            echo "Successfully deployed version ${VERSION} to EKS 🚀"
        }
        failure {
            echo "Build or Deployment failed ❌ — Check logs."
        }
    }
}
