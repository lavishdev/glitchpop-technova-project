# CrowdShield: Complete Project Documentation

## 1. Executive Summary & Vision

**CrowdShield** is an AI-powered crowd management and public safety platform designed to monitor dense environments like stadiums, festivals, transit hubs, and smart cities. By integrating seamlessly with existing IP CCTV cameras, CrowdShield provides real-time crowd density estimation, spatial heatmap generation, and automated incident alerts to both centralized control rooms and on-the-ground field officers.

**The core vision:** Prevent crowd crushes and stampedes proactively by predicting surges and dispatching personnel *before* critical incidents occur, guided by intelligent AI recommendations.

---

## 2. Current Working Architecture (MVP)

The current working model is built as a highly functional, tightly-coupled Minimum Viable Product (MVP) operating across four main modules:

1. **AI Service (Python / FastAPI):** The brain. Extracts frames from video streams/files, runs YOLOv11 person detection, calculates density metrics, plots spatial heatmaps, and proxies requests to the Google Gemini AI for intelligent reporting.
2. **Backend (Java / Spring Boot):** The central state manager. It acts as the API Gateway, handling JWT Authentication, saving metrics to a PostgreSQL database, and maintaining a STOMP WebSocket broker to broadcast real-time events.
3. **Admin Dashboard (Next.js):** The control room interface. It allows operators to monitor live "Virtual CCTV" feeds, view live AI heatmaps, review alerts, and dispatch field personnel.
4. **Mobile App (Flutter):** The field officer client. Officers receive push notifications via WebSockets, interact with a localized 2D Digital Twin map of the venue, and use an AI Assistant to quickly report incidents.

### 2.1 The Current Data Flow
1. A video feed is processed by the **FastAPI AI Node**.
2. YOLOv11 identifies individuals and calculates a high-risk density score.
3. A JSON payload and generated heatmap image are sent to the **Spring Boot Backend**.
4. The backend saves this to the **PostgreSQL** database and broadcasts a message over WebSockets (`/topic/live-heatmap`).
5. Both the **Next.js Dashboard** and **Flutter Mobile App** instantly receive this payload and update their UI, showing red zones or triggering sirens without refreshing the page.

![MVP Architecture](C:/Users/Lavish/.gemini/antigravity-ide/brain/c11761e9-f71a-497b-b5aa-8219bd38cfe6/detailed_architecture_1786987094060.jpg)

---

## 3. Core Feature Modules

### 3.1 Computer Vision Pipeline
The heart of CrowdShield is its localized Computer Vision engine. It processes raw video files (or simulated live streams) completely offline using `yolo11n.pt`. 
- **Tracking:** It assigns unique IDs to tracked objects using ByteTrack algorithms to prevent double-counting.
- **Heatmaps:** Instead of generic CSS overlays, Python natively plots bounding box coordinates onto a 2D canvas, applying a Gaussian blur to create a true, mathematically accurate heatmap (`heatmap_000001.jpg`).

### 3.2 Google Gemini AI Integration
CrowdShield utilizes Google's Gemini Large Language Model (LLM) as a dynamic Security Advisor. 
- The Spring Boot backend intercepts chat queries and injects the *current* state of the venue (e.g., "There are 4 active alerts, density is High at Gate A") directly into the prompt.
- Gemini then provides context-aware, actionable advice to officers based on live data, rather than generic templates.

### 3.3 The "Digital Twin" & WebSockets
Through Spring Boot's STOMP broker, the system achieves sub-second latency. When the AI detects a surge, the Next.js control room screen updates instantly, and the Flutter app's 2D Venue Map dynamically colors specific zones (e.g., "Sector A") in red to visually indicate danger to officers on the ground.

---

## 4. Future Working Architecture (Production-Grade)

While the MVP proves the concept, processing heavy video files synchronously across HTTP connections does not scale. To achieve a **production-grade** product capable of handling thousands of live CCTV cameras simultaneously, the future architecture introduces several major add-ons:

![Production Architecture](C:/Users/Lavish/.gemini/antigravity-ide/brain/c11761e9-f71a-497b-b5aa-8219bd38cfe6/production_grade_architecture_1786994597108.jpg)

### 4.1 Distributed Event Streaming (Apache Kafka)
**The Problem:** Currently, the Spring Boot API forwards video files to FastAPI and waits synchronously for minutes while the video processes, causing timeouts.
**The Future Add-on:** We will introduce **Apache Kafka**. 
- Video streams will be ingested directly, and Spring Boot will instantly emit a `VideoFrameIngestedEvent`.
- Dozens of scalable AI Nodes will consume this topic asynchronously, completely removing the HTTP bottleneck.

### 4.2 Edge Computing (AI on the Camera)
**The Problem:** Streaming raw 4K video from 1,000 cameras to a central cloud server requires massive, expensive bandwidth.
**The Future Add-on:** Lightweight YOLO models will be deployed directly onto **Edge Computing Nodes** connected locally to the CCTV cameras (e.g., NVIDIA Jetson Nanos). Only lightweight JSON metadata (coordinates and counts) will be sent over the internet to the central cloud.

### 4.3 Cloud Object Storage & Scalable Databases (AWS/GCP)
**The Problem:** Uploaded videos and heatmaps are currently saved to local disks (`/uploads/`). If the server restarts or scales, data is lost.
**The Future Add-on:** 
- **Amazon S3:** All raw video evidence and generated heatmaps will be streamed directly to cloud object storage.
- **PostgreSQL Cluster & Redis:** We will deploy highly available master-replica database clusters and a Redis distributed cache to handle millions of websocket sessions and API requests simultaneously.

### 4.4 Kubernetes Orchestration (EKS/GKE)
The entire suite (Backend, AI Nodes, Websocket Brokers) will be containerized via Docker and orchestrated via Kubernetes. This allows the system to automatically spin up 10 new GPU-accelerated AI pods if crowd traffic spikes unexpectedly during a major event.

---

## 5. Technical Debt & Current Limitations

Before migrating to the production-grade architecture, a few immediate technical debts exist in the MVP:
- **FastAPI Security:** Currently, the Python AI node endpoints (`/upload-video`, `/chat`) are unauthenticated. We need to implement internal API keys or restrict access strictly to the Spring Boot IP.
- **Database File Paths:** The database currently stores hardcoded `localhost` URLs for images. This needs to be refactored to store relative paths (or S3 URIs) to ensure the Next.js and Flutter apps don't break when deployed to cloud servers.

---

## 6. Local Development Setup

To run the full suite locally, you must run all four components in separate terminals:

1. **Database:** Ensure PostgreSQL is running on `localhost:5432` with a database named `crowdshield`.
2. **AI Service:** `cd ai-service`, activate Python `venv`, install `requirements.txt`, and run `python main.py` (Port 8000). Ensure `GEMINI_API_KEY` is set in `.env`.
3. **Backend:** `cd backend`, run `./mvnw spring-boot:run` (Port 8080).
4. **Next.js:** `cd admin-dashboard`, run `npm install` and `npm run dev` (Port 3000).
5. **Flutter:** `cd mobile-app`, run `flutter run` on an emulator. Pass the environment variables pointing to your backend:
   ```bash
   flutter run --dart-define=API_URL=http://10.0.2.2:8080/api --dart-define=WS_URL=ws://10.0.2.2:8080/ws-crowdshield
   ```
*(Note: Use `10.0.2.2` for Android Emulators, or `127.0.0.1` for iOS/Web).*
