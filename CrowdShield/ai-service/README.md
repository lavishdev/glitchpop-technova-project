# CrowdShield AI Service

Production-ready FastAPI service providing AI capabilities for crowd detection, risk estimation, video analytics, spatial heatmaps, and crowd flow simulation.

## Service Endpoints

- `GET /` - Root endpoint displaying service status and version
- `GET /health` - Health check endpoint

## Setup & Running

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```

3. **Start the Service**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
