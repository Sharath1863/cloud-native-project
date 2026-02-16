# 🌩️ Cloud-Native Project — Phase‑1 + Phase‑2 Combined README (Commands Reference)

This README is a **command-only quick reference** to revise the entire project from Docker → Kubernetes → EKS → CI/CD → Monitoring → Autoscaling.



---

# 📌 PROJECT JOURNEY

```
Phase‑1 → Docker + EC2 + CI/CD
Phase‑2 → Kubernetes + EKS + Ingress + Monitoring + HPA
```

---

# 🧱 PHASE‑1 — DOCKER + EC2 DEPLOYMENT

---

## 1️⃣ Launch EC2

* Ubuntu instance
* Open ports: 22, 80, 443, 8080

---

## 2️⃣ Install Docker

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

Verify:

```bash
docker --version
```

---

## 3️⃣ Install Docker Compose

```bash
sudo apt install docker-compose -y
```

Verify:

```bash
docker-compose --version
```

---

## 4️⃣ Deploy App via Compose

```bash
docker compose up -d
```

Check:

```bash
docker ps
```

---

## 5️⃣ Install Jenkins

```bash
sudo apt update
sudo apt install openjdk-17-jdk -y

curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee \
/usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
/etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins
```

Access:

```
http://EC2-IP:8080
```

---

## 6️⃣ Jenkins CI/CD Flow

Pipeline stages:

1. Checkout code
2. Build Docker images
3. Tag images
4. Push to Docker Hub
5. Deploy via docker‑compose

---

# ☸️ PHASE‑2 — KUBERNETES (EKS)

---

# 1️⃣ Install Tools

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

# 2️⃣ Configure AWS

```bash
aws configure
```

Verify:

```bash
aws sts get-caller-identity
```

---

# 3️⃣ Create EKS Cluster

```bash
eksctl create cluster \
--name cloud-native-cluster \
--region us-east-1 \
--nodegroup-name workers \
--node-type t3.medium \
--nodes 2
```

Verify:

```bash
kubectl get nodes
```

---

# 4️⃣ Update kubeconfig

```bash
aws eks update-kubeconfig \
--region us-east-1 \
--name cloud-native-cluster
```

---

# 5️⃣ Create Namespace

```bash
kubectl create namespace cloud-native
kubectl get ns
```

---

# 6️⃣ Deploy Application

```bash
kubectl apply -f k8s/
```

Verify:

```bash
kubectl get pods -n cloud-native
kubectl get svc -n cloud-native
```

---

# 7️⃣ Install Ingress Controller (Helm)

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

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

# 8️⃣ Apply Ingress Rules

```bash
kubectl apply -f k8s/ingress.yaml
kubectl get ingress -n cloud-native
```

Access app via LB DNS.

---

# 9️⃣ Jenkins → EKS Deployment Fix

Copy kubeconfig:

```bash
sudo cp /home/ubuntu/.kube/config /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
```

Copy AWS creds:

```bash
sudo mkdir -p /var/lib/jenkins/.aws
sudo cp /home/ubuntu/.aws/credentials /var/lib/jenkins/.aws/
sudo cp /home/ubuntu/.aws/config /var/lib/jenkins/.aws/
sudo chown -R jenkins:jenkins /var/lib/jenkins/.aws
```

Verify:

```bash
sudo -u jenkins kubectl get nodes
```

---

# 🔟 Install Monitoring Stack

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

# 1️⃣1️⃣ Access Grafana

```bash
kubectl port-forward svc/monitoring-grafana 3000:80 -n monitoring
```

Open:

```
http://localhost:3000
```

Get password:

```bash
kubectl get secret monitoring-grafana -n monitoring \
-o jsonpath="{.data.admin-password}" | base64 --decode
```

---

# 1️⃣2️⃣ Create HPA

```bash
kubectl apply -f k8s/backend-hpa.yaml
```

Verify:

```bash
kubectl get hpa -n cloud-native
```

---

# 1️⃣3️⃣ Load Testing

PowerShell:

```powershell
while ($true) {
 Invoke-WebRequest "http://<LB-DNS>/api" -UseBasicParsing | Out-Null
}
```

Observe:

```bash
kubectl get pods -n cloud-native -w
kubectl get hpa -n cloud-native -w
```

---

# 1️⃣4️⃣ Metrics Server (If Needed)

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

TLS Fix (EKS):

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

# ✅ FINAL STACK

| Layer         | Tool          |
| ------------- | ------------- |
| Containers    | Docker        |
| Orchestration | Kubernetes    |
| Managed K8s   | AWS EKS       |
| CI/CD         | Jenkins       |
| Registry      | Docker Hub    |
| Routing       | Ingress Nginx |
| Monitoring    | Prometheus    |
| Visualization | Grafana       |
| Autoscaling   | HPA           |

---

# 🏁 END OF REFERENCE

Use this as a **revision checklist** anytime before interviews or demos.
