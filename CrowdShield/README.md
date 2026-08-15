# CrowdShield 🛡️

CrowdShield is a comprehensive, AI-powered crowd management and public safety platform. It integrates a Flutter mobile application, a Next.js web admin dashboard, a Spring Boot centralized backend, and a FastAPI computer vision engine using YOLOv8 and Google Gemini to detect crowd density, predict risks, and respond to emergencies in real-time.

---

## 🏗️ System Architecture

- **Backend (Spring Boot)**: Acts as the central hub. Manages the database (H2 MVP), authentication, websockets, and API routing.
- **AI Service (FastAPI)**: Runs computer vision pipelines on video feeds to calculate crowd density and proxies requests to the Google Gemini AI assistant.
- **Admin Dashboard (Next.js)**: A comprehensive web portal for venue operators to monitor cameras, live crowd analytics, and active incidents.
- **Mobile App (Flutter)**: A mobile application for officers and personnel to report incidents, trigger SOS, and chat with the AI assistant.

---

## 🚀 Prerequisites

Ensure you have the following installed on your machine:
- **Java 17+** (For Spring Boot)
- **Node.js 18+ & npm** (For Next.js Admin Dashboard)
- **Python 3.10+** (For FastAPI AI Service)
- **Flutter SDK** (For Mobile App)
- **Git**

---

## ⚙️ Running the Project

To run the entire CrowdShield suite locally, you must spin up all four components in **four separate terminals**.

### 1. Start the AI Service (FastAPI)
The AI Service powers the computer vision models and the Gemini AI assistant.
1. Open a terminal and navigate to the `ai-service` directory.
2. Create your python virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup your Environment Variables:
   - Create a `.env` file in the `ai-service` folder.
   - Add your Gemini API Key: `GEMINI_API_KEY=your_actual_key_here`
5. Run the service:
   ```bash
   python main.py
   ```
*(Runs on `http://localhost:8000`)*

### 2. Start the Backend (Spring Boot)
The backend manages data, WebSockets, and proxies AI requests. It will automatically seed dummy data on startup.
1. Open a new terminal and navigate to the `backend` directory.
2. Run the application using the Maven wrapper:
   ```bash
   # On Windows:
   .\mvnw spring-boot:run
   # On Mac/Linux:
   ./mvnw spring-boot:run
   ```
*(Runs on `http://localhost:8080`)*

### 3. Start the Admin Dashboard (Next.js)
The command center for venue operators.
1. Open a new terminal and navigate to the `admin-dashboard` directory.
   *(Note: On Windows PowerShell, if you encounter an execution policy error, use `cmd.exe`)*
2. Install the Node packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
*(Runs on `http://localhost:3000`)*

### 4. Start the Mobile App (Flutter)
The mobile app for field officers.
1. Open a new terminal and navigate to the `mobile-app` directory.
2. Run the application on your preferred emulator or device. You MUST pass the API URLs to point to your local Spring Boot instance:
   ```bash
   flutter run --dart-define=API_URL=http://10.0.2.2:8080/api --dart-define=WS_URL=ws://10.0.2.2:8080/ws-crowdshield
   ```
   > **Note:** `10.0.2.2` is the alias for `localhost` inside an **Android Emulator**. If you are running on iOS, Chrome, or Windows Desktop, use `localhost` or `127.0.0.1` instead.

---

## 🧪 Testing the Integrations

Once all four systems are running, you can log into both the Next.js Admin Dashboard and the Flutter Mobile App using the default seeded credentials:

- **Username:** `admin`
- **Password:** `admin123`

### Key Flows to Test:
1. **Chat with AI:** Open the Assistant tab in the mobile app and ask a question. The request routes: `Flutter -> Spring Boot -> FastAPI -> Gemini`.
2. **Trigger an SOS:** Press the SOS button in the mobile app. Watch the live alert instantly appear on the Next.js Admin Dashboard via WebSockets.
3. **Computer Vision:** Send an `.mp4` file via POST to `http://localhost:8000/upload-video` to watch the YOLOv8 pipeline extract frames, track crowd density, and return a Risk Assessment PDF.
