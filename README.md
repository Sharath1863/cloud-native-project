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