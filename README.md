🚀 CloudNativeOps: Full-Stack Task Manager & Observability Suite
A professional-grade, containerized task management system featuring a "superb" dark-mode UI, automated CI/CD pipelines, and real-time infrastructure monitoring.

🏗️ Architecture
This project follows a Cloud-Native design pattern:

Frontend: React.js built with a "Deep Space" dark theme.

Backend: Python Flask API for task orchestration.

Proxy: Nginx acting as a Reverse Proxy and static file server.

Database: In-memory task storage (optimized for Phase 1).

Monitoring: Prometheus (Metrics collection) and Grafana (Visualization).

🛠️ Tech Stack
Runtime: Docker & Docker Compose.

CI/CD: Jenkins (Automated build and deploy).

Cloud: AWS EC2 (T2.micro/T3.micro).

Observability: Prometheus & Grafana.

🚀 Deployment Pipeline
The project utilizes a fully automated Jenkins Pipeline:

Code Commit: Developer pushes code to GitHub.

Jenkins Trigger: Webhook initiates the build on the EC2 instance.

Build Stage: Docker images are built for Frontend and Backend.

Deploy Stage: docker-compose up -d refreshes the production environment.

Health Check: Nginx verifies system availability.

📊 Monitoring & Performance
The system is integrated with a "Superb" monitoring stack to prevent production crashes:

Total Request Hits: Tracks cumulative API interaction.

Memory Usage: Real-time tracking of RAM to prevent "Status Check" failures.

Network Traffic: Visualizes I/O waves between services.

🔧 Installation & Local Setup
Clone the repository:

Bash
git clone https://github.com/your-username/cloud-native-ops.git
Start the stack:

Bash
docker-compose up --build -d
Access the UI at http://localhost:80 and Grafana at http://localhost:3001.

🛡️ Production Safety (Anti-Crash)
To handle resource exhaustion on small EC2 instances, this project includes:

Swap File: 2GB of emergency virtual RAM.

Resource Limits: Docker memory constraints for stable operation.

Health Checks: Nginx automated /health endpoint.

✅ Phase 1 Completed
[x] Containerize Full-Stack App

[x] Configure Nginx Reverse Proxy

[x] Setup Jenkins Automation

[x] Implement Prometheus/Grafana Monitoring





# 🌩️ Cloud‑Native Phase‑2 — Complete README (EKS + CI/CD + Ingress + Monitoring + HPA)

This README is a **full reference guide** for revising everything implemented in Phase‑2 — from cluster creation to autoscaling.

---

# 📌 Phase‑2 Objective

Move application from:

```
Docker on single EC2
```

to

```
Cloud‑Native Kubernetes Platform (AWS EKS)
```

With:

* CI/CD automation
* Ingress routing
* Monitoring
* Autoscaling

---

# 🧱 Architecture Overview

```
GitHub
   ↓
Jenkins CI/CD
   ↓
Docker Hub
   ↓
AWS EKS Cluster
   ↓
Pods (Frontend + Backend)
   ↓
Services (ClusterIP)
   ↓
Ingress Controller (Nginx)
   ↓
AWS LoadBalancer
   ↓
Users 🌍

Monitoring:
Pods → Metrics → Prometheus → Grafana
```

---

# 1️⃣ PREREQUISITES

## Install Tools

### AWS CLI

```bash
aws --version
```

### kubectl

```bash
kubectl version --client
```

### eksctl

```bash
eksctl version
```

### Helm

```bash
helm version
```

---

# 2️⃣ AWS CONFIGURATION

```bash
aws configure
```

Provide:

* Access Key
* Secret Key
* Region → us-east-1
* Output → json

Verify:

```bash
aws sts get-caller-identity
```

---

# 3️⃣ CREATE EKS CLUSTER

```bash
eksctl create cluster \
--name cloud-native-cluster \
--region us-east-1 \
--nodegroup-name workers \
--node-type t3.medium \
--nodes 2
```

Verify nodes:

```bash
kubectl get nodes
```

---

# 4️⃣ CONNECT KUBECTL TO EKS

```bash
aws eks update-kubeconfig \
--region us-east-1 \
--name cloud-native-cluster
```

---

# 5️⃣ PROJECT STRUCTURE

```
cloud-native-project/
 ├─ frontend/
 ├─ backend/
 ├─ nginx/
 ├─ k8s/
 │   ├─ frontend-deployment.yaml
 │   ├─ backend-deployment.yaml
 │   ├─ services.yaml
 │   ├─ ingress.yaml
 │   └─ hpa.yaml
 └─ Jenkinsfile
```

---

# 6️⃣ CREATE NAMESPACE

```bash
kubectl create namespace cloud-native
```

Verify:

```bash
kubectl get ns
```

---

# 7️⃣ DEPLOY APPLICATION

Apply manifests:

```bash
kubectl apply -f k8s/
```

Verify:

```bash
kubectl get pods -n cloud-native
kubectl get svc -n cloud-native
```

---

# 8️⃣ SERVICE TYPES

Used:

```
ClusterIP → Internal communication
```

Frontend → Port 80
Backend → TargetPort 5000

---

# 9️⃣ INSTALL INGRESS CONTROLLER (HELM)

Add repo:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

Install:

```bash
helm install ingress-nginx ingress-nginx/ingress-nginx \
--namespace ingress-nginx \
--create-namespace \
--set controller.service.type=LoadBalancer
```

Verify:

```bash
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

---

# 🔟 CREATE INGRESS RULES

Example:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cloud-native-ingress
  namespace: cloud-native
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```

Apply:

```bash
kubectl apply -f k8s/ingress.yaml
```

Get LB URL:

```bash
kubectl get ingress -n cloud-native
```

---

# 1️⃣1️⃣ CI/CD PIPELINE FLOW

Jenkins stages:

1. Checkout code
2. Build Docker images
3. Tag with build number
4. Push to Docker Hub
5. Update K8s manifests
6. Deploy to EKS

---

# 1️⃣2️⃣ MONITORING STACK

## Install Prometheus + Grafana

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
--namespace monitoring \
--create-namespace
```

Verify:

```bash
kubectl get pods -n monitoring
```

---

# Access Grafana

Port‑forward:

```bash
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring
```

Open:

```
http://localhost:3000
```

Get password:

```bash
kubectl get secret monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode
```

---

# 1️⃣3️⃣ DASHBOARDS TO CHECK

* Cluster CPU
* Node Memory
* Pod Usage
* Namespace metrics
* Network traffic

---

# 1️⃣4️⃣ HORIZONTAL POD AUTOSCALER (HPA)

## YAML Example

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: cloud-native

spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend

  minReplicas: 2
  maxReplicas: 10

  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

Apply:

```bash
kubectl apply -f k8s/backend-hpa.yaml
```

Verify:

```bash
kubectl get hpa -n cloud-native
```

---

# 1️⃣5️⃣ LOAD TESTING

PowerShell loop:

```powershell
while ($true) {
  Invoke-WebRequest "http://<LB-DNS>/api" -UseBasicParsing | Out-Null
}
```

Observe scaling:

```bash
kubectl get pods -n cloud-native -w
kubectl get hpa -n cloud-native -w
```

---

# 1️⃣6️⃣ METRICS SERVER (IF NEEDED)

Install:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Fix TLS (EKS):

```bash
kubectl patch deployment metrics-server -n kube-system \
--type='json' \
-p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```

Verify:

```bash
kubectl top pods -n cloud-native
```

---

# 📊 FINAL PHASE‑2 STACK

| Layer            | Tool          |
| ---------------- | ------------- |
| Containerization | Docker        |
| Orchestration    | Kubernetes    |
| Managed K8s      | AWS EKS       |
| CI/CD            | Jenkins       |
| Registry         | Docker Hub    |
| Routing          | Ingress Nginx |
| Load Balancing   | AWS ELB       |
| Monitoring       | Prometheus    |
| Visualization    | Grafana       |
| Autoscaling      | HPA           |

---

# 🧠 KEY CONCEPTS SUMMARY

* Pods run containers
* Services expose pods internally
* Ingress exposes services externally
* Helm installs platform tools
* Prometheus collects metrics
* Grafana visualizes metrics
* HPA scales pods automatically

---

# ✅ PHASE‑2 COMPLETION CHECKLIST

* [x] EKS cluster created
* [x] App deployed
* [x] Services configured
* [x] Ingress routing working
* [x] CI/CD pipeline working
* [x] Monitoring installed
* [x] Grafana dashboards visible
* [x] HPA configured
* [x] Load testing performed

---

# 🚀 NEXT (PHASE‑3 OPTIONS)

* GitOps (ArgoCD)
* Service Mesh (Istio)
* Canary deployments
* Blue/Green rollout
* Multi‑region HA

---

**End of Phase‑2 Reference README** ✅
