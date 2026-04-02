# 🚀 E-Commerce Microservices System (Docker + Kubernetes)

## 📌 Overview

This project is a **scalable microservices-based E-Commerce system** built using **Node.js, Docker, and Kubernetes**.
It demonstrates real-world architecture with **API Gateway, service communication, and container orchestration**.

---

## 🏗️ Architecture

```
Frontend (HTML/JS)
        ↓
API Gateway (NodePort)
        ↓
---------------------------------
| User Service   Product Service |
---------------------------------
        ↓
      MongoDB
```

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express
* **Frontend:** HTML, CSS, JavaScript
* **Database:** MongoDB
* **Containerization:** Docker
* **Orchestration:** Kubernetes (Minikube)
* **API Communication:** REST

---

## 📦 Microservices

| Service         | Port  | Description                     |
| --------------- | ----- | ------------------------------- |
| API Gateway     | 3000  | Routes requests to services     |
| User Service    | 3001  | Handles user registration/login |
| Product Service | 3002  | Manages products                |
| Order Service   | 3003  | Handles orders                  |
| MongoDB         | 27017 | Database                        |

---

## 🐳 Docker Setup

### 1. Build all services

```bash
docker compose build
```

### 2. Run all services

```bash
docker compose up -d
```

---

## ☸️ Kubernetes Deployment (Minikube)

### 1. Start Minikube

```bash
minikube start --driver=docker
```

### 2. Use Minikube Docker

```bash
eval $(minikube docker-env)
```

### 3. Build images

```bash
docker compose build
```

### 4. Deploy to Kubernetes

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

### 5. Check pods

```bash
kubectl get pods -n ecommerce
```

### 6. Get API Gateway URL

```bash
minikube service api-gateway -n ecommerce --url
```

---

## 🌐 Frontend Setup

### 1. Go to frontend

```bash
cd frontend
```

### 2. Update API URL

```js
const API = 'http://<MINIKUBE-IP>:30007/api';
```

### 3. Run frontend

```bash
npx serve . -p 8080
```

### 4. Open in browser

```
http://localhost:8080
```

---

## 🧪 API Testing

### Health Check

```bash
curl http://<MINIKUBE-IP>:30007/health
```

### Create Product

```bash
curl -X POST http://<MINIKUBE-IP>:30007/api/products \
-H "Content-Type: application/json" \
-d '{"name":"Laptop","price":1000}'
```

---

## 🔍 Logs (Debugging)

```bash
kubectl logs -f deployment/api-gateway -n ecommerce
kubectl logs -f deployment/product-service -n ecommerce
```

---

## ⚠️ Common Issues & Fixes

### ❌ CORS Error

✔ Fix:

```js
const cors = require('cors');
app.use(cors());
```

---

### ❌ Image Not Found

✔ Fix:

```bash
eval $(minikube docker-env)
docker compose build
```

---

### ❌ Service Not Reachable

✔ Ensure:

* Pod is running
* Service is created
* Correct API route exists

---

## 🎯 Features

* Microservices architecture
* API Gateway routing
* Docker containerization
* Kubernetes deployment
* Service discovery
* Scalable (multiple replicas)
* Frontend integration

---

## 🧠 Key Learnings

* Docker image management
* Kubernetes deployments & services
* Debugging distributed systems
* API Gateway design
* Handling CORS & networking

---

## 🏆 Conclusion

This project demonstrates a **production-style microservices system** with proper separation of concerns, scalability, and deployment using modern DevOps tools.

---

## 👨‍💻 Author

Prateek Choudhary

---
