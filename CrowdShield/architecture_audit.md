# CrowdShield Architecture & Codebase Audit

> [!IMPORTANT]  
> This document is based on a **direct inspection of the source code** and explicitly distinguishes between what is real, what is mocked, and what is disconnected.

---

## PART 1 — PROJECT OVERVIEW

**1. What CrowdShield is:**
CrowdShield is an AI-powered crowd management and safety platform designed to monitor dense public spaces (e.g., stadiums, festivals, transit hubs) using video feeds.

**2. What problem it is solving:**
It solves the problem of predicting and managing crowd surges, preventing stampedes, and dispatching safety personnel efficiently before critical incidents occur. 

**3. Who the users are:**
- **Control Room Operators / Admins:** Monitoring the Next.js Web Dashboard.
- **Field Security Officers:** Using the Flutter Mobile App on the ground.

**4. What the major components are:**
- An AI processing node (FastAPI)
- A central state/backend node (Spring Boot)
- An administrative dashboard (Next.js)
- A mobile client for officers (Flutter)

**5. Technologies and Responsibilities:**

| Component | Technology | Port | Responsibility | Communicates With |
| :--- | :--- | :--- | :--- | :--- |
| **FastAPI** | Python / FastAPI | `8000` | Video parsing, YOLOv11 person detection, heatmaps, risk calculation, Gemini AI integration. | Spring Boot |
| **Spring Boot** | Java 21 / Spring Boot 3 | `8080` | Central orchestrator, REST API, Database persistence, WebSocket broadcasting, Security (JWT). | Next.js, Flutter, PostgreSQL, FastAPI |
| **Next.js** | Next.js 16 (App Router), React, TS | `3000` | Admin dashboard for control room operators. Handles video uploads, live map rendering, and AI stat visualization. | Spring Boot |
| **Flutter** | Dart / Flutter 3 | `mobile` | Field officer app for alerts, incident reporting, interactive maps, and Gemini AI assistant chat. | Spring Boot |
| **PostgreSQL** | Relational Database | `5432` | Persistent storage for users, incidents, cameras, alerts, and historical crowd density. | Spring Boot |
| **Gemini** | Google GenAI SDK | `external` | LLM for generating automated recommendations, multilingual announcements, and chat responses. | FastAPI |

*(Note: These ports and technologies are explicitly defined in the `application.yml`, `main.py`, `package.json`, and `pubspec.yaml` files).*

---

## PART 2 — COMPLETE REPOSITORY STRUCTURE

```text
CrowdShield/
│
├── ai-service/ (FastAPI / Python)
│   ├── api/routes.py              # Central HTTP endpoints (/upload-video, /chat)
│   ├── models/schemas.py          # Pydantic validation schemas
│   ├── tracking/                  # CV logic (person_detector.py, heatmap_generator.py, multi_object_tracker.py)
│   ├── risk/                      # Risk assessment and alert generation rules
│   ├── recommendation/            # Heuristic-based recommendation engine
│   ├── reporting/                 # Gemini integration and PDF generation
│   ├── uploads/ & outputs/        # Static directories for raw video, extracted frames, heatmaps
│   └── main.py                    # App entry point, CORS, and static file mounts
│
├── backend/ (Spring Boot / Java)
│   └── src/main/java/com/crowdshield/
│       ├── analytics/             # AnalysisService.java (Orchestrates FastAPI upload)
│       ├── config/                # DatabaseSeeder, WebConfig, OpenApiConfig
│       ├── security/              # JWT Auth filters, SecurityConfig, UserDetailsService
│       ├── simulation/            # MockDataSimulator.java (The fake data generator)
│       ├── websocket/             # WebSocketConfig (STOMP on /ws-crowdshield)
│       └── [domain]/              # Entities/Repos/Services for alert, incident, camera, crowd, user
│
├── admin-dashboard/ (Next.js / React)
│   ├── src/app/(dashboard)/       # Next.js App Router pages (mission-control, ai-analysis, enhanced)
│   ├── src/components/            # Reusable UI (Cards, Badges, Modals)
│   ├── src/features/              # Domain slices (services, types, components)
│   └── src/services/ws/           # stompClient.ts (WebSocket connection)
│
└── mobile-app/ (Flutter / Dart)
    └── lib/
        ├── core/                  # Theme, network providers, unified WebSocket provider
        ├── features/              # Domain slices (home, maps, assistant, profile, sos, alerts)
        │   └── [feature]/
        │       ├── presentation/  # Riverpod Providers and UI Widgets/Pages
        │       └── data/          # Dio repositories mapping to Spring Boot APIs
        └── main.dart              # App entry, ProviderScope initialization
```

---

## PART 3 — COMPLETE SYSTEM ARCHITECTURE

```text
                       ┌──────────────────────┐
                       │ Control Room Admin   │
                       └──────────┬───────────┘
                                  │ (HTTP / WS)
                                  ▼
                       ┌──────────────────────┐
                       │  Next.js Dashboard   │
                       │     (Port 3000)      │
                       └──────────┬───────────┘
               Upload Video       │    ▲
               REST /api/...      │    │ WS /topic/live-heatmap
                                  ▼    │ WS /topic/alerts
                       ┌──────────────────────┐               ┌────────────────────┐
                       │   Spring Boot API    │ ◄───────────► │  Flutter App       │
                       │     (Port 8080)      │   REST / WS   │ (Field Officers)   │
                       └────┬────────────┬────┘               └────────────────────┘
          Save Entity /     │            │
          Fetch History     │            │ HTTP POST /upload-video
         (Spring Data JPA)  │            │ (Multipart Form)
                            ▼            ▼
                   ┌────────────┐   ┌──────────────────────┐
                   │ PostgreSQL │   │   FastAPI AI Node    │
                   │ (Port 5432)│   │     (Port 8000)      │
                   └────────────┘   └──────────┬───────────┘
                                               │ SDK
                                               ▼
                                    ┌──────────────────────┐
                                    │  Google Gemini API   │
                                    └──────────────────────┘
```

---

## PART 4 — REQUEST FLOW

### FLOW A — USER LOGIN
**Flow:** Field Officer / Admin → Auth Endpoint → DB Validation → JWT Return.
1. `login_form.dart` calls `authProvider.notifier.login()`.
2. `dio_auth_repository.dart` sends `POST http://localhost:8080/api/auth/login`.
3. Spring Boot `AuthController.java` delegates to `AuthenticationManager`.
4. `ApplicationConfig.java` loads user via `UserRepository.java` (DB check).
5. If valid, `JwtService.java` generates a Bearer token.
6. Token returned to Flutter; `authProvider` caches it using `flutter_secure_storage`.
7. Future requests append `Authorization: Bearer <token>` via Dio Interceptors.

### FLOW B — ADMIN DASHBOARD LOAD
**Flow:** Admin visits `/mission-control` → Fetch cameras.
1. `mission-control/page.tsx` mounts.
2. `useEffect` calls `cameraService.getCameras()`.
3. Axios sends `GET http://localhost:8080/api/cameras`.
4. Spring Boot `CameraController.java` → `CameraService.java`.
5. `CameraRepository.java` fetches virtual cameras from DB.
6. JSON returned mapped via `CameraMapper.java`.
7. React state updates `cameras[]`, re-rendering the Video feeds in the grid.

### FLOW C & D — VIDEO UPLOAD & AI PIPELINE (THE CRITICAL FLOW)
**Flow:** User uploads MP4 → FastAPI CV Pipeline → DB Persistence → WebSocket Broadcast.

1. **Frontend**: User uploads MP4 via Next.js `/ai-analysis` page (`aiAnalysisService.ts`).
2. **Spring Boot (Orchestrator)**: `AnalysisController.java` receives multipart file.
3. **Forwarding**: `AnalysisService.java` forwards the `MultipartFile` via `RestTemplate` to `POST http://127.0.0.1:8000/upload-video`.
4. **FastAPI (Pipeline)**:
    - *Storage*: `file_utils.py` saves to `/uploads/`.
    - *Frame Extraction*: `FrameExtractor` (OpenCV) extracts images to `/outputs/frames/`. **(REAL)**
    - *Detection*: `PersonDetector` runs `yolo11n.pt` to detect persons. **(REAL)**
    - *Tracking*: `MultiObjectTracker` assigns unique IDs. **(REAL)**
    - *Density*: `CrowdDensityEstimator` calculates people per frame. **(REAL)**
    - *Heatmap*: `HeatmapGenerator` plots bounding box coordinates on a 2D Gaussian canvas and saves as `heatmap_000001.jpg`. **(REAL)**
    - *Behavior*: `BehaviourDetector` uses heuristics (speed, overlap) to flag risk. **(PARTIALLY MOCKED - heuristic based)**
    - *Gemini*: `GeminiAnalyzer` sends raw metrics to Gemini LLM to write a summary/announcement. **(REAL)**
5. **Spring Boot (Callback)**: FastAPI returns massive JSON.
6. **State Override**: `AnalysisService.java` sets `appModeService.setSimulatorEnabled(false)`.
7. **Camera Creation**: Spring Boot creates a Virtual `Camera` entity with `videoUrl = http://localhost:8000/uploads/video.mp4`.
8. **Persistence**: `CrowdHistory` and `Alert` entities are saved.
9. **Broadcasting**: `messagingTemplate.convertAndSend("/topic/live-heatmap", aiResult)` pushes the heatmap URL and metrics to clients.
10. **UI Updates**: Next.js `dashboard/enhanced/page.tsx` receives WS message, updates React State, and visually renders the generated `<img src=".../heatmap_000001.jpg">`.

### FLOW E — SPRING BOOT ORCHESTRATION
Spring Boot acts purely as an API gateway, state manager, and router. 
- **AnalysisService**: The only service that touches FastAPI.
- **AppModeService**: A boolean toggle (`simulatorEnabled`) used to suppress fake data when real data exists.

### FLOW F — DATABASE ENTITIES
*Annotations used: `@Entity`, `@Id`, `@Enumerated`, `@ManyToOne` (Incident -> User for assignee).*
- `User`: Handles auth, roles (`ADMIN`, `ORGANISER`, `USER`).
- `Camera`: Represents a video source (contains `videoUrl`, `analysisId`, `status`).
- `CrowdHistory`: Time-series record of density at a location.
- `Alert`: Triggered warnings (`severity`, `message`).
- `Incident`: Formal security tickets assigned to users.

---

## PART 5 — AUTHENTICATION & SECURITY

**Spring Security implementation:**
- Handled in `SecurityConfig.java`.
- **JWT:** Uses custom `JwtAuthenticationFilter.java` validating `Bearer` tokens against a `SECRET_KEY`.
- **Public endpoints:** `/api/auth/**`, `/ws-crowdshield/**`, Swagger UI.
- **Protected:** Everything else requires an authenticated context.
- **Roles:** The DB seeds `ROLE_ADMIN`, `ROLE_ORGANISER`, `ROLE_SECURITY`. However, `@PreAuthorize` method security is currently NOT heavily enforced on the controllers, meaning any valid JWT can access most endpoints.

> [!WARNING]
> **403 Axios Error context:** Previously, Axios threw a 403 on the Next.js `ai-analysis` page. This occurred because Axios was manually appending a `Content-Type: multipart/form-data` header which stripped the boundary string, causing Spring Web to reject the malformed payload before it reached the controller. This has been fixed in the codebase.

---

## PART 6 — NEXT.JS ADMIN DASHBOARD

**Architecture:** App Router (`/src/app/(dashboard)/*`) with Tailwind CSS.
**Major Screens:**
- `/mission-control`: Renders actual `<video>` streams for uploaded MP4s (Virtual CCTV) with overlaid AI stats.
- `/dashboard/enhanced`: Subscribes to STOMP WebSocket `/topic/live-heatmap` to render the true FastAPI generated spatial heatmap.
- `/ai-analysis`: The file upload interface orchestrating the FastAPI pipeline.

**State & API:** 
Uses React Query (`@tanstack/react-query`) for polling standard endpoints and Axios instances (`src/lib/axios.ts`) appending the `localStorage` JWT.

---

## PART 7 — FLUTTER MOBILE APP

**Architecture:** Clean Architecture folders (`presentation`, `data`, `core`).
**State Management:** `flutter_riverpod` entirely controls state (e.g., `authProvider`, `mapProvider`, `websocketProvider`).
**Major Screens:**
- `Home`: Dashboard showing stats.
- `Map / Venue Zone Map`: 2D Interactive SVG mapping zones. 
- `Assistant`: UI for sending messages to Gemini via `AssistantProvider` -> `AssistantController`.
- `Alerts / SOS`: Interfaces for interacting with incidents.

**Reality vs Demo:** 
The Flutter app is entirely data-driven via Riverpod. If the Spring Boot `MockDataSimulator` is running, it renders fake alerts. If a real video is processed, the Simulator turns off, and Flutter reflects the exact state of the video processing.

---

## PART 8 — WEBSOCKETS / REAL-TIME SYSTEM

**Implementation:** Spring Boot `WebSocketConfig.java` defines a STOMP broker.
- **Endpoint:** `ws://localhost:8080/ws-crowdshield` (SockJS fallback allowed).
- **Topics:** 
  - `/topic/alerts`: Broadcasts new `AlertDto`.
  - `/topic/incidents`: Broadcasts new `IncidentDto`.
  - `/topic/dashboard`: Broadcasts overall metric aggregations.
  - `/topic/live-heatmap`: Broadcasts real-time AI density payloads and Heatmap image URLs.

**Clients:** Both Next.js (`stompClient.ts` / page effects) and Flutter (`websocket_provider.dart`) subscribe and update React/Riverpod state instantly.

---

## PART 9 — SIMULATOR / DEMO MODE

**Location:** `backend/src/main/java/com/crowdshield/simulation/MockDataSimulator.java`
**Logic:** A Spring `@Scheduled(fixedRate = 5000)` cron job.
**What it does:** Every 5 seconds, it generates random density numbers (50 - 250), calculates fake risk scores, creates fake `Alert` entities, and pushes fake data to `/topic/live-heatmap`.
**How it disables:** `AnalysisService.java` explicitly calls `appModeService.setSimulatorEnabled(false)` the moment a real video successfully processes, ensuring real data is not polluted by the cron job.

---

## PART 10 — VIDEO-BASED "LIVE CCTV"

**Location:** Uploaded videos are saved directly inside `ai-service/uploads/`.
**Implementation:** FastAPI mounts this directory via `StaticFiles`.
**UI:** In Next.js `/mission-control`, the dashboard iterates over the `cameras` array. Because the backend now creates a `Camera` entity with `videoUrl = http://127.0.0.1:8000/uploads/vid.mp4`, Next.js renders `<video src={cam.videoUrl} loop autoPlay>`.
**Result:** This achieves a "Virtual CCTV" effect where the original MP4 loops endlessly in the UI as the source of truth, completely overriding the old mock Unsplash backgrounds.

---

## PART 11 — HEATMAP

**Flow:** FastAPI OpenCV → YOLO Bounding Boxes → `tracking/heatmap_generator.py` → Draws Gaussian blur circles over coordinates → Saves as `heatmap_000001.jpg` in `/outputs/heatmaps/`.
**Delivery:** URL broadcasted via WebSocket `/topic/live-heatmap`.
**Display:** Next.js `/dashboard/enhanced/page.tsx` renders `<img src={liveHeatmapUrl} />`.
**Status:** **REAL AI HEATMAP.** The CSS-simulated radial-gradient mock heatmap has been completely removed from the codebase.

---

## PART 12 — 2D MAP / DIGITAL TWIN

**Location:** `mobile-app/lib/features/maps/presentation/widgets/interactive_digital_twin_map.dart`.
**Status:** **SIMULATED VISUALIZATION.** 
The map is a static interface (now renamed to "Venue Zone Map") representing zones like "Sector A", "Sector B". It does NOT use real geographic coordinates (GPS/Lat-Long). It is an interactive illustration where zones turn red/green based on the active risk/density state from the backend. 

---

## PART 13 — GEMINI AI ASSISTANT

**Flow:** 
1. Mobile App calls `POST /api/assistant/chat`.
2. Spring Boot `AssistantService.java` intercepts request, fetches real DB state (total alerts, active incidents, density).
3. Forwards Query + DB Context to FastAPI `POST /chat`.
4. FastAPI `GeminiAnalyzer.py` injects this into a prompt instructing the Google GenAI LLM to act as a security advisor.
5. Text response returned to Mobile UI.

**Context provided to Gemini:** Total alerts, active incidents, average crowd density, and online cameras.

---

## PART 14 — API INVENTORY

| Method | Endpoint | Service | Auth | Purpose | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Spring | Public | Authenticate and get JWT | USED |
| POST | `/api/auth/register` | Spring | Public | Create new user | USED |
| GET | `/api/analysis/history` | Spring | JWT | Get crowd history points | USED |
| POST | `/api/analysis/upload-video` | Spring | JWT | Submit video for AI processing | USED |
| GET | `/api/cameras` | Spring | JWT | Fetch active CCTV/Virtual cameras | USED |
| POST | `/api/cameras` | Spring | JWT | Add camera sensor | USED |
| GET | `/api/incidents` | Spring | JWT | Fetch security tickets | USED |
| POST | `/api/assistant/chat` | Spring | JWT | Chat with Gemini | USED |
| POST | `/upload-video` | FastAPI | None | Internal CV Pipeline entrypoint | INTERNAL |
| POST | `/chat` | FastAPI | None | Internal LLM proxy | INTERNAL |

---

## PART 15 — DATA FLOW DIAGRAM

```text
[VIDEO.mp4] 
    │
    ▼ (Upload via Next.js)
[SPRING BOOT API]
    │
    ▼ (REST Forward)
[FASTAPI] ───(Extract Frames)──► [YOLOv11] ──► (BBox/Tracks)
    │                                              │
    │◄────────(Heatmap & Density Stats)────────────┘
    │
    ├──► [GEMINI API] (Generate Report/Recommendations)
    │
    ▼ (JSON Response)
[SPRING BOOT] ──► (Saves: Cameras, History, Alerts in PostgreSQL)
    │
    ▼ (Broadcast via STOMP)
[WEBSOCKET BROKER]
    │
    ├──► [NEXT.JS DASHBOARD] (Renders heatmap image, loops video url)
    │
    └──► [FLUTTER APP] (Updates map colors, triggers local notifications)
```

---

## PART 16 — ONE COMPLETE REAL-WORLD SCENARIO

**Scenario:** Operator uploads video of a crowded entrance.

1. Operator logs into Next.js. JWT stored in `localStorage`. *(REAL)*
2. Operator navigates to `/ai-analysis` and selects `entrance.mp4`. *(REAL)*
3. Axios POSTs file to Spring Boot (`/api/analysis/upload-video`). *(REAL)*
4. Spring Boot forwards `entrance.mp4` to FastAPI. *(REAL)*
5. FastAPI saves file to `/uploads/entrance.mp4`. *(REAL)*
6. OpenCV extracts 300 frames. *(REAL)*
7. YOLOv11 detects 150 people per frame. *(REAL)*
8. Python scripts calculate HIGH density and plot red hotspots on `heatmap_000001.jpg`. *(REAL)*
9. FastAPI returns a massive JSON payload. *(REAL)*
10. Spring Boot turns off `MockDataSimulator`. *(REAL)*
11. Spring Boot creates `Camera(videoUrl="http://127.0.0.1:8000/uploads/entrance.mp4")`. *(REAL)*
12. Spring Boot broadcasts JSON to STOMP `/topic/live-heatmap`. *(REAL)*
13. Next.js receives WS payload. `/mission-control` re-renders displaying a looping `<video src=".../entrance.mp4">`. *(REAL)*
14. Next.js `/dashboard/enhanced` re-renders displaying `<img src=".../heatmap_000001.jpg">`. *(REAL)*
15. Flutter Field Officer receives alert via WebSocket that density is HIGH, rendering the "Venue Zone Map" Sector red. *(REAL)*

---

## PART 17 — DEPENDENCIES

**FastAPI (requirements.txt):**
- `fastapi`, `uvicorn`: API server framework.
- `ultralytics`: YOLOv11 for person detection.
- `opencv-python`: Frame extraction and image manipulation.
- `google-generativeai`: Gemini LLM connection.

**Spring Boot (pom.xml):**
- `spring-boot-starter-web`, `spring-boot-starter-data-jpa`: Core framework and DB.
- `spring-boot-starter-security`: JWT Auth.
- `spring-boot-starter-websocket`: STOMP broker implementation.
- `postgresql`: DB Driver.

**Next.js (package.json):**
- `next (16.3.0)`: React framework.
- `axios`: HTTP client.
- `@stomp/stompjs`: WebSocket connection.
- `tailwindcss`: Styling.

**Flutter (pubspec.yaml):**
- `flutter_riverpod`: State management.
- `dio`: HTTP client.
- `stomp_dart_client`: WebSocket client.

---

## PART 18 — CONFIGURATION & ENVIRONMENT VARIABLES

| Variable | Service | Purpose | Format / Example | Required? |
| :--- | :--- | :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | Backend | DB Connection | `jdbc:postgresql://localhost:5432/crowdshield` | YES |
| `JWT_SECRET_KEY` | Backend | Token generation | `<SECRET>` | YES |
| `GEMINI_API_KEY` | FastAPI | LLM Authentication | `<SECRET>` | YES |
| `simulator.enabled` | Backend | Toggles cron jobs | `true` or `false` | NO |
| `NEXT_PUBLIC_API_URL` | Next.js | Backend mapping | `http://localhost:8080/api` | YES |

---

## PART 19 — HOW TO RUN THE WHOLE PROJECT

1. **Terminal 1 (Database):** Ensure PostgreSQL is running on port `5432` with a database named `crowdshield` (user/pass matching `application.yml`).
2. **Terminal 2 (AI Service):** Navigate to `ai-service`, activate `venv`, install requirements, and run `uvicorn main:app --port 8000 --reload`.
3. **Terminal 3 (Spring Boot):** Navigate to `backend`, run `./mvnw clean spring-boot:run`. (Boots on `8080`, seeds DB, starts simulator).
4. **Terminal 4 (Next.js):** Navigate to `admin-dashboard`, run `npm run dev`. (Boots on `3000`).
5. **Terminal 5 (Flutter):** Navigate to `mobile-app`, run `flutter run` with a physical Android device or emulator.

---

## PART 20 — CURRENT PROBLEMS / TECHNICAL DEBT

| Issue | Severity | Where | Why it matters | Recommended fix |
| :--- | :--- | :--- | :--- | :--- |
| **No API Key on FastAPI** | HIGH | `routes.py` | FastAPI endpoints are entirely unauthenticated. Anyone can hit `/upload-video`. | Add simple API key middleware restricting access to only the Spring Boot server. |
| **Synchronous Video Processing** | HIGH | `AnalysisService.java` | Spring Web blocks the HTTP thread while FastAPI processes a large MP4 (which takes seconds/minutes). | Make the Spring-FastAPI connection asynchronous, returning a 202 Accepted and using WebSockets for completion. |
| **Database File Paths** | LOW | `AnalysisService.java` | The DB saves hardcoded URLs (`http://localhost:8000/uploads/...`) instead of relative paths. | Store relative paths and prepend domains dynamically at the frontend layer. |

---

## PART 21 — WHAT IS ACTUALLY REAL?

**REAL:**
- Uploaded videos parsing through OpenCV and YOLOv11.
- Generation of spatial heatmaps from bounding boxes.
- PostgreSQL database persistence (Users, Alerts, CrowdHistory).
- JWT Authentication logic.
- Gemini API LLM dynamic responses based on backend state.
- WebSocket broadcasting.

**MOCKED / SIMULATED:**
- The 2D venue map in Flutter (static SVG, no geographic ties).
- The `MockDataSimulator` (generates fake data until a real video is uploaded).
- The dashboard "Mission Control" when no video is uploaded (displays empty state or placeholder imagery if configured).

---

## PART 22 — ARCHITECTURAL CONCERNS

1. **Duplicate Sources of Truth:** The AI service saves images to `/outputs/` and `/uploads/`. Spring Boot only stores references to these paths. If the Python directory is cleared, the Next.js database links will 404. 
2. **Synchronous Upload Limits:** `application.yml` increased multipart max to 500MB, but waiting for a 500MB video to finish OpenCV processing synchronously will cause Axios/Browser timeouts.

---

## PART 23 — RECOMMENDED FINAL ARCHITECTURE

**Current:** Browser -> Spring -> FastAPI -> Wait 2 minutes -> Spring -> WebSocket -> Browser.
**Recommended:**
1. Browser uploads MP4 directly to an S3 Bucket / Object Store.
2. Spring Boot emits a Kafka event: `VideoUploadedEvent(s3_url)`.
3. FastAPI consumes event, downloads video, runs pipeline asynchronously, uploads Heatmap to S3.
4. FastAPI emits Kafka event: `AnalysisCompleteEvent(results)`.
5. Spring Boot consumes event, updates DB, fires WebSocket to Next.js/Flutter.
*(This eliminates the synchronous HTTP bottleneck between Spring and FastAPI).*

---

## PART 24 — BEGINNER-FRIENDLY EXPLANATION

**What happens when I upload a video?**
Imagine you are a security guard. You take a video of a crowded stadium gate and upload it to the Next.js Dashboard. The Dashboard sends the video to the Java Backend (the manager). The manager says, "I don't have eyes," and immediately hands the video to the Python AI (the brain). 

The Python AI looks at every single frame of the video, draws a box around every person it sees, counts them, and draws a red heatmap where people are standing too close together. It writes a report and hands the report and images back to the Java manager.

The Java manager saves the report in its PostgreSQL filing cabinet. It then grabs a megaphone (WebSockets) and shouts to everyone in the building: "NEW DATA AVAILABLE!" 

The Next.js Dashboard hears the shout and instantly displays the video playing on a loop, placing the red heatmap on the screen. The Flutter Mobile App in the pocket of a field officer hears the shout, turns its map screen red, and buzzes the officer's phone. Finally, if you ask the Gemini AI Chatbot what to do, it reads the Java manager's latest report and tells you exactly which gates to open.

---

## PART 25 — FINAL ONE-PAGE CHEAT SHEET

```text
CrowdShield
│
├── Frontend
│   ├── Next.js (3000) → Admin web dashboard
│   └── Flutter (mobile) → Field Officer app
│
├── Backend
│   └── Spring Boot (8080) → Main API, JWT Auth, DB access, WebSocket Broker
│
├── AI
│   └── FastAPI (8000) → OpenCV, YOLO CV Pipeline, Gemini SDK
│
└── Database
    └── PostgreSQL (5432)
```

**IF I REMEMBER ONLY 10 THINGS ABOUT CROWDSHIELD, REMEMBER THESE:**
1. **Spring Boot** is the traffic cop; **FastAPI** does the heavy lifting.
2. The AI actually processes videos using **YOLOv11** and **OpenCV**; it is not fake.
3. Uploaded videos become **"Virtual CCTV Cameras"**, overriding the mock data.
4. **WebSockets (STOMP)** are used to instantly push heatmaps and alerts to all screens.
5. **Next.js** serves the control room admins via web.
6. **Flutter (Riverpod)** serves field officers via mobile.
7. **Gemini AI** is integrated, dynamically fed real DB context by Spring Boot.
8. The **MockDataSimulator** runs fake numbers every 5 seconds until you upload a video.
9. **JWT** secures the Spring Boot endpoints (Next/Flutter pass tokens via headers).
10. The 2D Digital Twin is an illustrative **Zone Map**, not a real GPS mapping system.
